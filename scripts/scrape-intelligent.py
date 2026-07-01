#!/usr/bin/env python3
"""
RITS Intelligent Scraper
========================
Scrapes job boards for globally-eligible listings, uses Gemini to classify
and summarize JDs, and syncs results to a Supabase cache for incremental updates.

Architecture:
  1. Read source boards from Supabase (or fall back to built-in list).
  2. For each board: fetch listings via API (preferred) or HTML scrape.
  3. For each listing: extract JD text, run global-accessibility filter.
  4. For listings that pass: use Gemini to classify category, summarize JD,
     and assess nationality openness.
  5. Deduplicate against Supabase via content_hash (SHA256 of title+company+url).
  6. Insert new jobs, update last_seen for existing, mark missing as inactive.
  7. Log the run to scrape_runs.

Usage:
  python3 scripts/scrape-intelligent.py                    # scrape all active boards
  python3 scripts/scrape-intelligent.py --board himalayas  # scrape one board
  python3 scripts/scrape-intelligent.py --dry-run          # don't write to DB
  python3 scripts/scrape-intelligent.py --no-gemini        # skip Gemini processing

Environment variables:
  GEMINI_API_KEY       — Google Gemini API key (required for --gemini mode)
  SUPABASE_DB_URL      — Postgres connection string (read from .env)
  VITE_SUPABASE_URL    — Supabase project URL
  VITE_SUPABASE_ANON_KEY — Supabase anon key
"""

import argparse
import hashlib
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from datetime import date, datetime, timezone

# Load .env file if present
def _load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    os.environ.setdefault(k.strip(), v.strip())

_load_env()

# ---------------------------------------------------------------------------
#  Configuration
# ---------------------------------------------------------------------------

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GEMINI_MODEL = 'gemini-2.0-flash'
GEMINI_ENDPOINT = f'https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent'

SUPABASE_URL = os.environ.get('VITE_SUPABASE_URL', '')
SUPABASE_ANON_KEY = os.environ.get('VITE_SUPABASE_ANON_KEY', '')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
SUPABASE_DB_URL = os.environ.get('SUPABASE_DB_URL', os.environ.get('VITE_SUPABASE_DB_URL', ''))

# ---------------------------------------------------------------------------
#  Source boards (fallback if DB is unavailable)
# ---------------------------------------------------------------------------

FALLBACK_BOARDS = [
    {
        'id': 'himalayas',
        'name': 'Himalayas',
        'url': 'https://himalayas.app',
        'board_type': 'api',
        'api_url': 'https://himalayas.app/jobs/api/search',
        'category_focus': 'general remote; data analytics, dev, AI',
    },
    {
        'id': 'remoteok',
        'name': 'RemoteOK',
        'url': 'https://remoteok.com',
        'board_type': 'api',
        'api_url': 'https://remoteok.com/api',
        'category_focus': 'remote; AI/ML, dev, data',
    },
    {
        'id': 'eslcafe',
        'name': "Dave's ESL Cafe",
        'url': 'https://www.eslcafe.com',
        'board_type': 'scrape',
        'api_url': None,
        'category_focus': 'ESL/EFL worldwide',
    },
    {
        'id': 'wwr',
        'name': 'We Work Remotely',
        'url': 'https://weworkremotely.com',
        'board_type': 'scrape',
        'api_url': None,
        'category_focus': 'general remote; data, dev',
    },
    {
        'id': 'jobspresso',
        'name': 'Jobspresso',
        'url': 'https://jobspresso.co',
        'board_type': 'scrape',
        'api_url': None,
        'category_focus': 'curated remote; data, dev',
    },
    {
        'id': 'workingnomads',
        'name': 'Working Nomads',
        'url': 'https://www.workingnomads.com',
        'board_type': 'scrape',
        'api_url': None,
        'category_focus': 'remote digital jobs; data, dev',
    },
    {
        'id': '4dayweek',
        'name': '4 Day Week',
        'url': 'https://4dayweek.io',
        'board_type': 'scrape',
        'api_url': None,
        'category_focus': 'remote with 4-day work weeks',
    },
    {
        'id': 'teflcom',
        'name': 'TEFL.com',
        'url': 'https://www.tefl.com',
        'board_type': 'scrape',
        'api_url': None,
        'category_focus': 'ESL/TEFL teaching positions globally',
    },
]

# ---------------------------------------------------------------------------
#  Global-accessibility filter (keyword-based pre-filter before Gemini)
# ---------------------------------------------------------------------------

NATIONALITY_RESTRICTION_KEYWORDS = [
    'native speaker only', 'native english speaker required',
    'must be a citizen', 'us citizens only', 'uk citizens only',
    'eu citizens only', 'passport holder required',
    'restricted to nationals of', 'only applicants from',
]

RESIDENCY_KEYWORDS = [
    'resident in india for the last', 'resident in the united states for the last',
    'must reside in', 'must be resident in',
]

GLOBAL_ACCESS_KEYWORDS = [
    'worldwide', 'anywhere in the world', 'work from anywhere',
    'remote worldwide', 'all nationalities', 'no nationality restriction',
    'global remote', 'international remote', 'location independent',
    'open to all', 'non-native speakers welcome', 'non-native welcome',
    'non-native speakers', 'from any country',
]

NATIVE_SPEAKER_CAUTION_KEYWORDS = [
    'native speaker', 'native english', 'native-level',
]


def assess_global_access(text):
    """Returns (passes_filter, confidence, caution_note)."""
    text_lower = text.lower()

    for kw in NATIONALITY_RESTRICTION_KEYWORDS:
        if kw in text_lower:
            return False, 0.2, 'Explicit nationality restriction detected'

    for kw in RESIDENCY_KEYWORDS:
        if kw in text_lower:
            return False, 0.3, 'Residency requirement detected'

    global_signals = sum(1 for kw in GLOBAL_ACCESS_KEYWORDS if kw in text_lower)
    caution_signals = sum(1 for kw in NATIVE_SPEAKER_CAUTION_KEYWORDS if kw in text_lower)

    if caution_signals > 0 and global_signals == 0:
        return True, 0.85, 'Native speaker preference noted; verify non-native acceptance'

    if caution_signals > 0 and global_signals > 0:
        return True, 0.92, 'Native speaker preference, but non-natives may apply'

    if global_signals >= 2:
        return True, 0.97, None

    if global_signals == 1:
        return True, 0.96, None

    if 'online' in text_lower and ('teach' in text_lower or 'tutor' in text_lower):
        return True, 0.95, None

    return False, 0.5, 'No global access indicators found'


# ---------------------------------------------------------------------------
#  HTTP helpers
# ---------------------------------------------------------------------------

def fetch_url(url, timeout=15, headers=None):
    """Fetch raw HTML/JSON from a URL. Returns (status_code, body_text) or (None, error)."""
    hdrs = {'User-Agent': 'RITS-Scraper/1.0 (https://github.com/hig2026/RITS)'}
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, headers=hdrs)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        return e.code, str(e)
    except Exception as e:
        return None, str(e)


def fetch_json(url, timeout=15, headers=None):
    """Fetch and parse JSON. Returns dict or None."""
    status, body = fetch_url(url, timeout, headers)
    if status != 200 or not body:
        return None
    try:
        return json.loads(body)
    except json.JSONDecodeError:
        return None


# ---------------------------------------------------------------------------
#  Gemini AI — classify, summarize, and assess JDs
# ---------------------------------------------------------------------------

def gemini_classify_jd(title, company, jd_text):
    """
    Use Gemini to classify a job listing and generate a summary.
    Returns dict with: category, work_mode, summary, is_globally_accessible, confidence.
    Falls back to keyword-based assessment if Gemini is unavailable.
    """
    if not GEMINI_API_KEY:
        passes, confidence, caution = assess_global_access(jd_text)
        return {
            'category': _guess_category(title, jd_text),
            'work_mode': _guess_work_mode(jd_text),
            'summary': jd_text[:300] + '...' if len(jd_text) > 300 else jd_text,
            'is_globally_accessible': passes,
            'confidence': confidence,
            'caution': caution,
        }

    prompt = f"""You are a job listing analyzer for RITS, a site that lists globally-eligible jobs for Indian applicants.

Analyze this job listing and return JSON with these exact fields:
- "category": one of "ESL Tutoring", "Analytics/Data Science", "AI Training", "Insurance/Reinsurance Analytics", "General Remote"
- "work_mode": one of "Worldwide Remote", "Visa Sponsorship", "India-based, Open to All Nationalities", "Hybrid Remote", "Onsite"
- "summary": 2-3 sentence summary of the role and requirements
- "is_globally_accessible": true if the role is open to applicants of any nationality (including Indians), false if it restricts by nationality or residency
- "confidence": 0.0-1.0 confidence that this role is open to all nationalities
- "caution": any nationality-related caution note, or null

Job title: {title}
Company: {company}

Job description:
{jd_text[:3000]}

Return ONLY valid JSON, no markdown fences."""

    body = json.dumps({
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {
            'temperature': 0.1,
            'maxOutputTokens': 500,
            'responseMimeType': 'application/json',
        },
    }).encode('utf-8')

    req = urllib.request.Request(
        f'{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}',
        data=body,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode('utf-8'))
            text = result['candidates'][0]['content']['parts'][0]['text']
            parsed = json.loads(text)
            return {
                'category': parsed.get('category', _guess_category(title, jd_text)),
                'work_mode': parsed.get('work_mode', _guess_work_mode(jd_text)),
                'summary': parsed.get('summary', jd_text[:300]),
                'is_globally_accessible': parsed.get('is_globally_accessible', True),
                'confidence': float(parsed.get('confidence', 0.9)),
                'caution': parsed.get('caution'),
            }
    except Exception as e:
        print(f"  Gemini error: {e}", file=sys.stderr)
        passes, confidence, caution = assess_global_access(jd_text)
        return {
            'category': _guess_category(title, jd_text),
            'work_mode': _guess_work_mode(jd_text),
            'summary': jd_text[:300] + '...' if len(jd_text) > 300 else jd_text,
            'is_globally_accessible': passes,
            'confidence': confidence,
            'caution': caution,
        }


def _guess_category(title, jd_text):
    text_lower = (title + ' ' + jd_text).lower()
    if any(kw in text_lower for kw in ['esl', 'efl', 'teach english', 'tutor', 'tefl']):
        return 'ESL Tutoring'
    if any(kw in text_lower for kw in ['ai training', 'ai trainer', 'data label', 'rlhf', 'machine learning training']):
        return 'AI Training'
    if any(kw in text_lower for kw in ['catastrophe', 'cat model', 'reinsurance', 'actuarial']):
        return 'Insurance/Reinsurance Analytics'
    if any(kw in text_lower for kw in ['data analyst', 'data scientist', 'analytics', 'data engineer', 'bi ']):
        return 'Analytics/Data Science'
    return 'General Remote'


def _guess_work_mode(jd_text):
    text_lower = jd_text.lower()
    if 'worldwide' in text_lower or 'anywhere in the world' in text_lower:
        return 'Worldwide Remote'
    if 'visa' in text_lower and 'sponsor' in text_lower:
        return 'Visa Sponsorship'
    if 'hybrid' in text_lower:
        return 'Hybrid Remote'
    if 'remote' in text_lower:
        return 'Worldwide Remote'
    return 'Onsite'


# ---------------------------------------------------------------------------
#  Board scrapers
# ---------------------------------------------------------------------------

def scrape_himalayas(board, max_jobs=30):
    """Scrape Himalayas via free public API."""
    print(f"  Fetching Himalayas API...", file=sys.stderr)
    data = fetch_json(board['api_url'], timeout=20)
    if not data or 'jobs' not in data:
        print(f"  Himalayas API returned no jobs", file=sys.stderr)
        return []

    jobs = []
    for j in data['jobs'][:max_jobs]:
        title = j.get('title', '')
        company = j.get('company_name', j.get('company', 'Unknown'))
        url = j.get('url', j.get('apply_url', ''))
        if not title or not url:
            continue

        jd_text = j.get('description', j.get('summary', ''))
        if not jd_text:
            jd_text = f"{title} at {company}. Remote role via Himalayas."

        jobs.append({
            'title': title[:120],
            'company': company[:80],
            'source_url': url,
            'company_url': j.get('company_url', ''),
            'jd_text': jd_text,
            'source_board_id': 'himalayas',
        })

    return jobs


def scrape_remoteok(board, max_jobs=30):
    """Scrape RemoteOK via JSON API."""
    print(f"  Fetching RemoteOK API...", file=sys.stderr)
    data = fetch_json(board['api_url'], timeout=20)
    if not data or not isinstance(data, list) or len(data) < 2:
        print(f"  RemoteOK API returned no jobs", file=sys.stderr)
        return []

    # First element is metadata, rest are jobs
    job_list = data[1:] if isinstance(data[0], dict) and 'slug' not in data[0] else data

    jobs = []
    for j in job_list[:max_jobs]:
        title = j.get('position', j.get('title', ''))
        company = j.get('company', 'Unknown')
        url = j.get('url', f"https://remoteok.com/remote-jobs/{j.get('id', '')}")
        if not title:
            continue

        jd_text = j.get('description', j.get('summary', ''))
        if not jd_text:
            jd_text = f"{title} at {company}. Remote role via RemoteOK."

        # Strip HTML tags from description
        jd_text = re.sub(r'<[^>]+>', ' ', jd_text).strip()

        tags = j.get('tags', [])
        if 'worldwide' in [t.lower() for t in tags]:
            jd_text = 'Worldwide remote. ' + jd_text

        jobs.append({
            'title': title[:120],
            'company': company[:80],
            'source_url': url,
            'company_url': j.get('company_url', ''),
            'jd_text': jd_text[:5000],
            'source_board_id': 'remoteok',
            'tags': tags,
        })

    return jobs


def scrape_eslcafe(board, max_jobs=20):
    """Scrape Dave's ESL Cafe international job board."""
    print(f"  Fetching ESL Cafe...", file=sys.stderr)
    status, html = fetch_url('https://www.eslcafe.com/jobs/international', timeout=15)
    if status != 200 or not html:
        print(f"  ESL Cafe fetch failed: {status}", file=sys.stderr)
        return []

    # Extract job links from the listing page
    job_links = re.findall(r'href="(/jobs/international/[^"]+)"', html)
    if not job_links:
        job_links = re.findall(r'href="(https://www\.eslcafe\.com/jobs/international/[^"]+)"', html)

    seen = set()
    jobs = []
    for link in job_links[:max_jobs]:
        if link.startswith('/'):
            link = 'https://www.eslcafe.com' + link
        if link in seen:
            continue
        seen.add(link)

        time.sleep(0.5)
        s, body = fetch_url(link, timeout=10)
        if s != 200 or not body:
            continue

        # Extract title from page
        title_match = re.search(r'<title>([^<]+)</title>', body)
        title = title_match.group(1).strip() if title_match else 'ESL Position'
        if ' - ' in title:
            title = title.split(' - ')[0].strip()

        # Extract body text (strip HTML)
        jd_text = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL)
        jd_text = re.sub(r'<style[^>]*>.*?</style>', '', jd_text, flags=re.DOTALL)
        jd_text = re.sub(r'<[^>]+>', ' ', jd_text)
        jd_text = re.sub(r'\s+', ' ', jd_text).strip()

        if len(jd_text) < 50:
            continue

        jobs.append({
            'title': title[:120],
            'company': 'ESL Cafe listed employer',
            'source_url': link,
            'company_url': 'https://www.eslcafe.com/',
            'jd_text': jd_text[:5000],
            'source_board_id': 'eslcafe',
        })

    return jobs


def scrape_wwr(board, max_jobs=20):
    """Scrape We Work Remotely — fetch category pages, extract individual job URLs."""
    print(f"  Fetching We Work Remotely...", file=sys.stderr)
    categories = ['/remote-data-jobs', '/remote-analyst-jobs', '/remote-ai-ml-jobs']
    jobs = []

    for cat in categories:
        status, html = fetch_url(f'https://weworkremotely.com{cat}', timeout=15)
        if status != 200 or not html:
            continue

        # Extract individual job URLs
        job_links = re.findall(r'href="(/remote-jobs/[^"]+)"', html)
        seen = set()

        for link in job_links[:10]:
            if link.startswith('/'):
                link = 'https://weworkremotely.com' + link
            if link in seen:
                continue
            seen.add(link)

            time.sleep(0.5)
            s, body = fetch_url(link, timeout=10)
            if s != 200 or not body:
                continue

            title_match = re.search(r'<title>([^<]+)</title>', body)
            title = title_match.group(1).strip() if title_match else 'Remote Position'
            title = re.sub(r'\s*[-|]\s*We Work Remotely.*$', '', title).strip()

            jd_text = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL)
            jd_text = re.sub(r'<style[^>]*>.*?</style>', '', jd_text, flags=re.DOTALL)
            jd_text = re.sub(r'<[^>]+>', ' ', jd_text)
            jd_text = re.sub(r'\s+', ' ', jd_text).strip()

            if len(jd_text) < 50:
                continue

            jobs.append({
                'title': title[:120],
                'company': 'WWR listed employer',
                'source_url': link,
                'company_url': 'https://weworkremotely.com/',
                'jd_text': jd_text[:5000],
                'source_board_id': 'wwr',
            })

            if len(jobs) >= max_jobs:
                break
        if len(jobs) >= max_jobs:
            break

    return jobs


def scrape_jobspresso(board, max_jobs=15):
    """Scrape Jobspresso curated remote jobs."""
    print(f"  Fetching Jobspresso...", file=sys.stderr)
    status, html = fetch_url('https://jobspresso.co/remote-jobs/', timeout=15)
    if status != 200 or not html:
        print(f"  Jobspresso fetch failed: {status}", file=sys.stderr)
        return []

    job_links = re.findall(r'href="(https://jobspresso\.co/job/[^"]+)"', html)
    if not job_links:
        job_links = re.findall(r'href="(/job/[^"]+)"', html)

    seen = set()
    jobs = []
    for link in job_links[:max_jobs]:
        if link.startswith('/'):
            link = 'https://jobspresso.co' + link
        if link in seen:
            continue
        seen.add(link)

        time.sleep(0.5)
        s, body = fetch_url(link, timeout=10)
        if s != 200 or not body:
            continue

        title_match = re.search(r'<title>([^<]+)</title>', body)
        title = title_match.group(1).strip() if title_match else 'Remote Position'
        title = re.sub(r'\s*[-|]\s*Jobspresso.*$', '', title).strip()

        jd_text = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL)
        jd_text = re.sub(r'<style[^>]*>.*?</style>', '', jd_text, flags=re.DOTALL)
        jd_text = re.sub(r'<[^>]+>', ' ', jd_text)
        jd_text = re.sub(r'\s+', ' ', jd_text).strip()

        if len(jd_text) < 50:
            continue

        jobs.append({
            'title': title[:120],
            'company': 'Jobspresso listed employer',
            'source_url': link,
            'company_url': 'https://jobspresso.co/',
            'jd_text': jd_text[:5000],
            'source_board_id': 'jobspresso',
        })

    return jobs


def scrape_workingnomads(board, max_jobs=15):
    """Scrape Working Nomads data/analyst category."""
    print(f"  Fetching Working Nomads...", file=sys.stderr)
    # Try multiple URL patterns
    urls_to_try = [
        'https://www.workingnomads.com/jobs/remote-data-analyst-jobs',
        'https://www.workingnomads.com/jobs/remote-data-science-jobs',
        'https://www.workingnomads.com/jobs/remote-development-jobs',
    ]
    jobs = []
    for page_url in urls_to_try:
        status, html = fetch_url(page_url, timeout=15)
        if status != 200 or not html:
            continue

        # Try multiple link patterns
        job_links = re.findall(r'href="(/jobs/remote-[a-z-]+/[a-z0-9-]+)"', html)
        if not job_links:
            job_links = re.findall(r'href="(/job/[a-z0-9-]+)"', html)
        if not job_links:
            job_links = re.findall(r'href="(https://www\.workingnomads\.com/jobs/[^"]+)"', html)
        if not job_links:
            # Try finding job cards with data attributes
            job_links = re.findall(r'data-url="([^"]+)"', html)

        seen = set()
        for link in job_links[:max_jobs]:
            if link.startswith('/'):
                link = 'https://www.workingnomads.com' + link
            if link in seen:
                continue
            seen.add(link)

            time.sleep(0.5)
            s, body = fetch_url(link, timeout=10)
            if s != 200 or not body:
                continue

            title_match = re.search(r'<title>([^<]+)</title>', body)
            title = title_match.group(1).strip() if title_match else 'Remote Position'
            title = re.sub(r'\s*[-|]\s*Working Nomads.*$', '', title).strip()

def scrape_4dayweek(board, max_jobs=15):
    """Scrape 4 Day Week data jobs."""
    print(f"  Fetching 4 Day Week...", file=sys.stderr)
    urls_to_try = [
        'https://4dayweek.io/remote-jobs/data',
        'https://4dayweek.io/remote-jobs/software',
        'https://4dayweek.io/remote-jobs',
    ]
    jobs = []
    for page_url in urls_to_try:
        status, html = fetch_url(page_url, timeout=15)
        if status != 200 or not html:
            continue

        job_links = re.findall(r'href="(/remote-jobs/[^"]+)"', html)
        if not job_links:
            job_links = re.findall(r'href="(https://4dayweek\.io/remote-jobs/[^"]+)"', html)
        if not job_links:
            job_links = re.findall(r'href="(/job/[^"]+)"', html)

        seen = set()
        for link in job_links[:max_jobs]:
            if link.startswith('/'):
                link = 'https://4dayweek.io' + link
            if link in seen:
                continue
            seen.add(link)

            time.sleep(0.5)
            s, body = fetch_url(link, timeout=10)
            if s != 200 or not body:
                continue

            title_match = re.search(r'<title>([^<]+)</title>', body)
            title = title_match.group(1).strip() if title_match else 'Remote Position'
            title = re.sub(r'\s*[-|]\s*4 Day Week.*$', '', title).strip()


SCRAPERS = {
    'himalayas': scrape_himalayas,
    'remoteok': scrape_remoteok,
    'eslcafe': scrape_eslcafe,
    'wwr': scrape_wwr,
    'jobspresso': scrape_jobspresso,
    'workingnomads': scrape_workingnomads,
    '4dayweek': scrape_4dayweek,
    'teflcom': scrape_eslcafe,
}


# ---------------------------------------------------------------------------
#  Deduplication
# ---------------------------------------------------------------------------

def content_hash(title, company, source_url):
    """Generate a stable hash for deduplication."""
    raw = f"{title.lower().strip()}|{company.lower().strip()}|{source_url.strip()}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()


# ---------------------------------------------------------------------------
#  Supabase sync
# ---------------------------------------------------------------------------

def get_source_boards():
    """Fetch source boards from Supabase, fall back to built-in list."""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return FALLBACK_BOARDS

    url = f"{SUPABASE_URL}/rest/v1/source_boards?is_active=eq.true"
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    }
    status, body = fetch_url(url, headers=headers, timeout=10)
    if status == 200 and body:
        try:
            boards = json.loads(body)
            if boards:
                return boards
        except json.JSONDecodeError:
            pass
    return FALLBACK_BOARDS


def get_existing_hashes(board_id):
    """Get set of content_hashes currently active for a board from Supabase."""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return set()

    url = f"{SUPABASE_URL}/rest/v1/scraped_jobs?source_board_id=eq.{board_id}&is_active=eq.true&select=content_hash"
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    }
    status, body = fetch_url(url, headers=headers, timeout=10)
    if status == 200 and body:
        try:
            rows = json.loads(body)
            return {r['content_hash'] for r in rows}
        except (json.JSONDecodeError, KeyError):
            pass
    return set()


def upsert_job(job_data):
    """Insert a new job or update last_seen for an existing one. Returns 'added' or 'updated' or 'error'."""
    if not SUPABASE_URL:
        return 'error'

    key = SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY
    url = f"{SUPABASE_URL}/rest/v1/scraped_jobs"
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal',
    }

    payload = {
        'source_board_id': job_data['source_board_id'],
        'title': job_data['title'],
        'company': job_data['company'],
        'category': job_data.get('category', 'General Remote'),
        'work_mode': job_data.get('work_mode', 'Worldwide Remote'),
        'source_url': job_data['source_url'],
        'company_url': job_data.get('company_url', ''),
        'jd_summary': job_data.get('jd_summary'),
        'jd_text': job_data.get('jd_text', '')[:5000],
        'confidence': job_data.get('confidence', 0.9),
        'score': job_data.get('score', 3.0),
        'pay': job_data.get('pay'),
        'tags': json.dumps(job_data.get('tags', [])),
        'nationality_caution': job_data.get('caution'),
        'content_hash': job_data['content_hash'],
        'is_active': True,
        'last_seen': datetime.now(timezone.utc).isoformat(),
        'gemini_processed': job_data.get('gemini_processed', False),
        'verified_on': date.today().isoformat(),
    }

    body = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return 'added' if resp.status in (200, 201) else 'error'
    except urllib.error.HTTPError as e:
        if e.code == 409:
            return 'updated'
        return 'error'
    except Exception:
        return 'error'


def mark_expired_jobs(board_id, active_hashes):
    """Mark jobs that were NOT seen this run as inactive. Returns count expired."""
    if not SUPABASE_URL:
        return 0

    key = SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY
    # Get all active hashes for this board
    url = f"{SUPABASE_URL}/rest/v1/scraped_jobs?source_board_id=eq.{board_id}&is_active=eq.true&select=id,content_hash"
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}',
    }
    status, body = fetch_url(url, headers=headers, timeout=10)
    if status != 200 or not body:
        return 0

    try:
        rows = json.loads(body)
    except json.JSONDecodeError:
        return 0

    expired_count = 0
    for row in rows:
        if row['content_hash'] not in active_hashes:
            # Mark as inactive
            update_url = f"{SUPABASE_URL}/rest/v1/scraped_jobs?id=eq.{row['id']}"
            update_headers = {
                'apikey': key,
                'Authorization': f'Bearer {key}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
            }
            update_body = json.dumps({'is_active': False}).encode('utf-8')
            req = urllib.request.Request(update_url, data=update_body, headers=update_headers, method='PATCH')
            try:
                urllib.request.urlopen(req, timeout=10)
                expired_count += 1
            except Exception:
                pass

    return expired_count


def log_scrape_run(run_data):
    """Insert a scrape run record."""
    if not SUPABASE_URL:
        return

    key = SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY
    url = f"{SUPABASE_URL}/rest/v1/scrape_runs"
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
    }
    body = json.dumps(run_data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    try:
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        print(f"  Failed to log scrape run: {e}", file=sys.stderr)


# ---------------------------------------------------------------------------
#  Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description='RITS Intelligent Scraper')
    parser.add_argument('--board', type=str, help='Scrape only this board ID')
    parser.add_argument('--dry-run', action='store_true', help='Do not write to database')
    parser.add_argument('--no-gemini', action='store_true', help='Skip Gemini AI processing')
    parser.add_argument('--max-jobs', type=int, default=25, help='Max jobs per board')
    args = parser.parse_args()

    print("=" * 60, file=sys.stderr)
    print("RITS Intelligent Scraper", file=sys.stderr)
    print(f"Gemini: {'enabled' if GEMINI_API_KEY and not args.no_gemini else 'disabled'}", file=sys.stderr)
    print(f"Supabase: {'connected' if SUPABASE_URL else 'not configured (dry-run mode)'}", file=sys.stderr)
    print(f"Dry run: {args.dry_run}", file=sys.stderr)
    print("=" * 60, file=sys.stderr)

    # Get source boards
    boards = get_source_boards()
    if args.board:
        boards = [b for b in boards if b['id'] == args.board]
        if not boards:
            print(f"Board '{args.board}' not found", file=sys.stderr)
            sys.exit(1)

    use_gemini = bool(GEMINI_API_KEY) and not args.no_gemini
    is_dry_run = args.dry_run or not SUPABASE_URL

    run_start = datetime.now(timezone.utc).isoformat()
    total_found = 0
    total_added = 0
    total_updated = 0
    total_expired = 0
    all_errors = []

    for board in boards:
        board_id = board['id']
        scraper = SCRAPERS.get(board_id)
        if not scraper:
            msg = f"No scraper for board '{board_id}', skipping"
            print(f"  {msg}", file=sys.stderr)
            all_errors.append({'board': board_id, 'error': msg})
            continue

        print(f"\n--- Scraping: {board['name']} ({board_id}) ---", file=sys.stderr)
        try:
            raw_jobs = scraper(board, max_jobs=args.max_jobs)
            print(f"  Found {len(raw_jobs)} raw listings", file=sys.stderr)
            total_found += len(raw_jobs)
        except Exception as e:
            msg = f"Scraper error for {board_id}: {e}"
            print(f"  ERROR: {msg}", file=sys.stderr)
            all_errors.append({'board': board_id, 'error': msg})
            continue

        # Get existing hashes for this board
        existing_hashes = set() if is_dry_run else get_existing_hashes(board_id)
        active_hashes = set()

        for raw in raw_jobs:
            chash = content_hash(raw['title'], raw['company'], raw['source_url'])
            active_hashes.add(chash)

            if chash in existing_hashes:
                # Already in DB — update last_seen
                if not is_dry_run:
                    result = upsert_job({**raw, 'content_hash': chash})
                    if result == 'added':
                        total_added += 1
                    else:
                        total_updated += 1
                print(f"  = {raw['title'][:50]} (already cached)", file=sys.stderr)
                continue

            # Pre-filter with keyword-based check
            passes, conf, caution = assess_global_access(raw['jd_text'])
            if not passes:
                print(f"  - {raw['title'][:50]} (filtered: {caution})", file=sys.stderr)
                continue

            # Gemini classification
            if use_gemini:
                print(f"  * Gemini classifying: {raw['title'][:50]}...", file=sys.stderr)
                ai = gemini_classify_jd(raw['title'], raw['company'], raw['jd_text'])
                if not ai['is_globally_accessible']:
                    print(f"  - {raw['title'][:50]} (Gemini: not globally accessible)", file=sys.stderr)
                    continue

                job_data = {
                    **raw,
                    'content_hash': chash,
                    'category': ai['category'],
                    'work_mode': ai['work_mode'],
                    'jd_summary': ai['summary'],
                    'confidence': ai['confidence'],
                    'caution': ai['caution'],
                    'gemini_processed': True,
                    'score': 3.0,
                    'tags': raw.get('tags', []),
                }
            else:
                job_data = {
                    **raw,
                    'content_hash': chash,
                    'category': _guess_category(raw['title'], raw['jd_text']),
                    'work_mode': _guess_work_mode(raw['jd_text']),
                    'jd_summary': raw['jd_text'][:300],
                    'confidence': conf,
                    'caution': caution,
                    'gemini_processed': False,
                    'score': 3.0,
                    'tags': raw.get('tags', []),
                }

            if not is_dry_run:
                result = upsert_job(job_data)
                if result == 'added':
                    total_added += 1
                else:
                    total_updated += 1

            print(f"  + {raw['title'][:50]} [{job_data['category']}] ({job_data['confidence']:.0%})", file=sys.stderr)

        # Mark expired jobs
        if not is_dry_run and active_hashes:
            expired = mark_expired_jobs(board_id, active_hashes)
            total_expired += expired
            if expired:
                print(f"  Marked {expired} expired jobs as inactive", file=sys.stderr)

        # Update board's last_scraped
        if not is_dry_run:
            key = SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY
            update_url = f"{SUPABASE_URL}/rest/v1/source_boards?id=eq.{board_id}"
            update_headers = {
                'apikey': key,
                'Authorization': f'Bearer {key}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
            }
            update_body = json.dumps({'last_scraped': datetime.now(timezone.utc).isoformat()}).encode('utf-8')
            req = urllib.request.Request(update_url, data=update_body, headers=update_headers, method='PATCH')
            try:
                urllib.request.urlopen(req, timeout=10)
            except Exception:
                pass

    # Log the run
    run_end = datetime.now(timezone.utc).isoformat()
    print(f"\n{'=' * 60}", file=sys.stderr)
    print(f"Run complete", file=sys.stderr)
    print(f"  Found:     {total_found}", file=sys.stderr)
    print(f"  Added:     {total_added}", file=sys.stderr)
    print(f"  Updated:   {total_updated}", file=sys.stderr)
    print(f"  Expired:   {total_expired}", file=sys.stderr)
    print(f"  Errors:    {len(all_errors)}", file=sys.stderr)

    if not is_dry_run:
        log_scrape_run({
            'started_at': run_start,
            'finished_at': run_end,
            'source_board_id': args.board,
            'jobs_found': total_found,
            'jobs_added': total_added,
            'jobs_expired': total_expired,
            'jobs_unchanged': total_updated,
            'errors': json.dumps(all_errors),
            'status': 'completed' if not all_errors else 'completed_with_errors',
        })

    # Output summary as JSON
    print(json.dumps({
        'found': total_found,
        'added': total_added,
        'updated': total_updated,
        'expired': total_expired,
        'errors': all_errors,
    }, indent=2))


if __name__ == '__main__':
    main()
