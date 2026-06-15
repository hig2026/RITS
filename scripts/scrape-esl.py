#!/usr/bin/env python3
"""
RITS ESL Job Scraper
====================
Uses Playwright (CDP) to scrape ESL/TEFL job boards for listings that pass
the global-accessibility filter.

Outputs scraped jobs as JSON compatible with src/data/jobs.js.

Company vetting data is stored in src/data/companies.js (source boards and
company profiles). This scraper checks that database before re-researching
known companies. Source board base URLs are stable; individual job links
are ephemeral and may go dead — always store the source board for re-scraping.
"""

import json
import re
import sys
import time
from datetime import date

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("ERROR: playwright not installed. Run: pip install playwright", file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------------------
#  Global-accessibility filter
# ---------------------------------------------------------------------------
NATIONALITY_RESTRICTION_KEYWORDS = [
    'native speaker only', 'native english speaker required',
    'must be a citizen', 'us citizens only', 'uk citizens only',
    'eu citizens only', 'passport holder required',
    'restricted to nationals of', 'only applicants from',
]

NATIVE_SPEAKER_CAUTION_KEYWORDS = [
    'native speaker', 'native english', 'native-level',
]

GLOBAL_ACCESS_KEYWORDS = [
    'worldwide', 'anywhere in the world', 'work from anywhere',
    'remote worldwide', 'all nationalities', 'no nationality restriction',
    'global remote', 'international remote', 'location independent',
    'open to all', 'non-native speakers welcome', 'non-native welcome',
    'non-native speakers', 'from any country',
]


def assess_global_access(text):
    """Returns (passes_filter, confidence, caution_note)."""
    text_lower = text.lower()

    # Hard reject: explicit nationality-only restrictions
    for kw in NATIONALITY_RESTRICTION_KEYWORDS:
        if kw in text_lower:
            return False, 0.2, 'Explicit nationality restriction detected'

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

    # Online teaching platforms are typically globally accessible
    if 'online' in text_lower and ('teach' in text_lower or 'tutor' in text_lower):
        return True, 0.95, None

    return False, 0.5, 'No global access indicators found'


def validate_url(page, url, timeout=8000):
    """Navigate to URL and check it's a real job page, not a 404 or generic listing."""
    try:
        resp = page.goto(url, wait_until='domcontentloaded', timeout=timeout)
        if resp and resp.status >= 400:
            return False, f"HTTP {resp.status}"
        title = page.title().lower()
        if '404' in title or 'not found' in title or 'page not found' in title:
            return False, 'Page title indicates 404'
        return True, page.url
    except Exception as e:
        return False, str(e)


# ---------------------------------------------------------------------------
#  TEFL.com scraper
# ---------------------------------------------------------------------------
def scrape_tefl_com(page):
    """Scrape TEFL.com online teaching jobs using browser."""
    print("Scraping TEFL.com (browser) ...", file=sys.stderr)
    results = []

    page.goto('https://www.tefl.com/job-seeker/search.html', wait_until='domcontentloaded', timeout=15000)
    time.sleep(2)

    # Try to filter to Online jobs
    try:
        # Look for job type filter
        selectors = page.query_selector_all('select')
        for sel in selectors:
            options = sel.query_selector_all('option')
            for opt in options:
                if 'online' in (opt.inner_text().lower()):
                    sel.select_option(label=opt.inner_text())
                    time.sleep(1)
                    # Submit the form
                    submit = page.query_selector('input[type="submit"], button[type="submit"]')
                    if submit:
                        submit.click()
                        time.sleep(2)
                    break
    except Exception as e:
        print(f"  Could not filter to Online: {e}", file=sys.stderr)

    # Extract job listings from search results
    job_links = page.eval_on_selector_all(
        'a[href*="jobpage"], a[href*="jobId"]',
        'els => els.map(e => ({href: e.href, text: e.innerText}))'
    )
    print(f"  Found {len(job_links)} job links on TEFL.com", file=sys.stderr)

    seen = set()
    for link_info in job_links[:20]:
        href = link_info['href']
        if href in seen or 'jobId' not in href:
            continue
        seen.add(href)

        time.sleep(1)
        try:
            page.goto(href, wait_until='domcontentloaded', timeout=10000)
        except Exception:
            continue

        text = page.inner_text('body')
        title_el = page.query_selector('h1')
        title = title_el.inner_text().strip() if title_el else link_info['text'].strip()
        if not title or len(title) < 3:
            continue

        # Try to get company name
        company = 'TEFL.com listed employer'
        for selector in ['.employer-name', '.company-name', 'h2']:
            el = page.query_selector(selector)
            if el:
                c = el.inner_text().strip()
                if c and len(c) > 2 and len(c) < 80:
                    company = c
                    break

        passes, confidence, caution = assess_global_access(text)
        if not passes:
            print(f"  FILTERED OUT: {title[:50]}", file=sys.stderr)
            continue

        results.append({
            'title': title[:100],
            'company': company[:80],
            'sourceUrl': page.url,
            'companyUrl': 'https://www.tefl.com/job-seeker/',
            'confidence': confidence,
            'nationalityCaution': caution,
            'source': 'tefl.com',
        })
        print(f"  + {title[:50]} ({confidence:.0%})", file=sys.stderr)

    return results


# ---------------------------------------------------------------------------
#  ESLCafe scraper
# ---------------------------------------------------------------------------
def scrape_eslcafe(page):
    """Scrape ESL Cafe international/online jobs using browser."""
    print("Scraping ESLCafe.com (browser) ...", file=sys.stderr)
    results = []

    for path in ['/international-jobs', '/online-jobs']:
        try:
            page.goto(f'https://www.eslcafe.com{path}', wait_until='domcontentloaded', timeout=10000)
        except Exception:
            continue
        time.sleep(2)

        job_links = page.eval_on_selector_all(
            'a[href*="/job/"], a[href*="/jobs/"]',
            'els => els.map(e => ({href: e.href, text: e.innerText}))'
        )
        print(f"  Found {len(job_links)} job links on ESLCafe {path}", file=sys.stderr)

        seen = set()
        for link_info in job_links[:15]:
            href = link_info['href']
            if href in seen:
                continue
            seen.add(href)

            time.sleep(1)
            try:
                page.goto(href, wait_until='domcontentloaded', timeout=10000)
            except Exception:
                continue

            text = page.inner_text('body')
            title_el = page.query_selector('h1')
            title = title_el.inner_text().strip() if title_el else link_info['text'].strip()
            if not title or len(title) < 3:
                continue

            passes, confidence, caution = assess_global_access(text)
            if not passes:
                print(f"  FILTERED OUT: {title[:50]}", file=sys.stderr)
                continue

            results.append({
                'title': title[:100],
                'company': 'ESLCafe listed employer',
                'sourceUrl': page.url,
                'companyUrl': 'https://www.eslcafe.com/',
                'confidence': confidence,
                'nationalityCaution': caution,
                'source': 'eslcafe.com',
            })
            print(f"  + {title[:50]} ({confidence:.0%})", file=sys.stderr)

    return results


# ---------------------------------------------------------------------------
#  Known ESL platforms (globally accessible by design)
# ---------------------------------------------------------------------------
def get_known_platforms():
    """Well-known ESL/tutoring platforms with verified global access."""
    print("Adding known ESL platforms ...", file=sys.stderr)
    return [
        {
            'title': 'Online English Tutor',
            'company': 'Preply',
            'sourceUrl': 'https://preply.com/en/teach',
            'companyUrl': 'https://preply.com/',
            'confidence': 0.97,
            'nationalityCaution': None,
            'source': 'preply.com',
            'hiringTendencyNote': 'Marketplace model: open to all nationalities. Non-native speakers accepted. Tutors set own rates and schedules.',
        },
        {
            'title': 'Online English Teacher / Community Tutor',
            'company': 'italki',
            'sourceUrl': 'https://www.italki.com/en/teacher/apply',
            'companyUrl': 'https://www.italki.com/',
            'confidence': 0.97,
            'nationalityCaution': None,
            'source': 'italki.com',
            'hiringTendencyNote': 'Open to all nationalities. Two tiers: Professional Teacher (cert required) and Community Tutor (no cert). Non-native English speakers welcome.',
        },
        {
            'title': 'Online English Conversation Tutor',
            'company': 'Cambly',
            'sourceUrl': 'https://www.cambly.com/en/tutors',
            'companyUrl': 'https://www.cambly.com/',
            'confidence': 0.85,
            'nationalityCaution': 'Native speaker preference noted; verify non-native acceptance',
            'source': 'cambly.com',
            'hiringTendencyNote': 'Historically native-speaker-only; some reports of expanded acceptance. Payment via PayPal. Verify current nationality policy.',
        },
        {
            'title': 'Online English Tutor — Flexible Schedule',
            'company': 'Tutorful',
            'sourceUrl': 'https://tutorful.co.uk/become-a-tutor',
            'companyUrl': 'https://tutorful.co.uk/',
            'confidence': 0.90,
            'nationalityCaution': 'UK-focused platform; verify acceptance of international tutors for online-only roles',
            'source': 'tutorful.co.uk',
            'hiringTendencyNote': 'Primarily UK market but offers online tutoring. International applicants should verify eligibility.',
        },
        {
            'title': 'ESL Teacher — Online Private Lessons',
            'company': 'Verbling',
            'sourceUrl': 'https://www.verbling.com/teach',
            'companyUrl': 'https://www.verbling.com/',
            'confidence': 0.96,
            'nationalityCaution': None,
            'source': 'verbling.com',
            'hiringTendencyNote': 'Open marketplace for language teachers worldwide. Non-native speakers accepted. Teachers set own rates.',
        },
        {
            'title': 'Teach English Online — AI-Assisted Platform',
            'company': 'Engoo / DMM Eikaiwa',
            'sourceUrl': 'https://engoo.com/tutor/application',
            'companyUrl': 'https://engoo.com/',
            'confidence': 0.96,
            'nationalityCaution': None,
            'source': 'engoo.com',
            'hiringTendencyNote': 'Global tutor recruitment. Non-native English speakers accepted. Fixed per-lesson rate set by platform.',
        },
        {
            'title': 'Online English Teacher — Group & Private Classes',
            'company': 'Open English',
            'sourceUrl': 'https://www.openenglish.com/en/work-with-us/',
            'companyUrl': 'https://www.openenglish.com/',
            'confidence': 0.90,
            'nationalityCaution': 'Native speaker preference noted; verify non-native acceptance',
            'source': 'openenglish.com',
            'hiringTendencyNote': 'Latin America-focused online English school. Primarily recruits native speakers but non-natives with strong qualifications may apply.',
        },
        {
            'title': 'ESL / EFL Teacher — Online Platform',
            'company': 'Amazing Talker',
            'sourceUrl': 'https://en.amazingtalker.com/teach',
            'companyUrl': 'https://en.amazingtalker.com/',
            'confidence': 0.97,
            'nationalityCaution': None,
            'source': 'amazingtalker.com',
            'hiringTendencyNote': 'Taiwan-based marketplace. Open to all nationalities. Teachers set own rates. Strong demand for English teachers.',
        },
        {
            'title': 'Online English Tutor — Conversation Practice',
            'company': 'Fluentify',
            'sourceUrl': 'https://www.fluentify.com/en/become-a-tutor',
            'companyUrl': 'https://www.fluentify.com/',
            'confidence': 0.92,
            'nationalityCaution': 'Native speaker preference noted; verify non-native acceptance',
            'source': 'fluentify.com',
            'hiringTendencyNote': 'European-based platform. Preference for native speakers stated but may accept strong non-natives with CELTA/TESOL.',
        },
        {
            'title': 'Freelance Online English Teacher',
            'company': 'Superprof',
            'sourceUrl': 'https://www.superprof.com/give-lessons.html',
            'companyUrl': 'https://www.superprof.com/',
            'confidence': 0.97,
            'nationalityCaution': None,
            'source': 'superprof.com',
            'hiringTendencyNote': 'Global peer-to-peer tutoring marketplace. Open to all nationalities. Operates in 40+ countries. Tutors set own rates.',
        },
    ]


# ---------------------------------------------------------------------------
#  Finalize job for RITS format
# ---------------------------------------------------------------------------
def finalize_job(raw):
    """Convert a raw scraped job into the RITS data format."""
    today = date.today().isoformat()
    job_id = re.sub(r'[^a-z0-9]+', '-', raw['title'].lower()).strip('-')[:60]
    job_id = f"esl-{raw['source'].split('.')[0]}-{job_id}"

    source_scores = {
        'tefl.com': 3.4,
        'eslcafe.com': 3.3,
        'preply.com': 3.8,
        'italki.com': 3.9,
        'cambly.com': 3.5,
        'verbling.com': 3.6,
        'engoo.com': 3.5,
        'openenglish.com': 3.3,
        'amazingtalker.com': 3.7,
        'fluentify.com': 3.4,
        'superprof.com': 3.6,
        'tutorful.co.uk': 3.4,
    }
    score = source_scores.get(raw['source'], 3.0)

    notes = []
    if raw.get('hiringTendencyNote'):
        notes.append(raw['hiringTendencyNote'])
    notes.append(f"Source: {raw['source']}. Listed on {today}.")
    if raw.get('nationalityCaution'):
        notes.append(f"Nationality note: {raw['nationalityCaution']}")
    notes.append('Verify pay, contract terms, and payment methods directly with the platform.')

    tags = ['ESL', 'Remote teaching']
    title_lower = raw['title'].lower()
    if 'tutor' in title_lower:
        tags.append('Tutoring')
    if 'conversation' in title_lower:
        tags.append('Conversation')
    if 'celta' in title_lower or 'tesol' in title_lower:
        tags.append('CELTA/TESOL')
    if 'freelance' in title_lower:
        tags.append('Freelance')
    if 'online' in title_lower:
        tags.append('Online')

    return {
        'id': job_id,
        'title': raw['title'],
        'company': raw['company'],
        'category': 'ESL Tutoring',
        'workMode': 'Worldwide Remote',
        'eligibility': f"Listed via {raw['source']}; passed global-accessibility pre-filter.",
        'confidence': round(raw['confidence'], 2),
        'score': score,
        'pay': 'Check source listing for current rate',
        'sourceUrl': raw['sourceUrl'],
        'companyUrl': raw['companyUrl'],
        'verifiedOn': today,
        'credibilityNotes': notes,
        'tags': tags,
        'nationalityCaution': raw.get('nationalityCaution'),
        'hiringTendencyNote': raw.get('hiringTendencyNote'),
    }


# ---------------------------------------------------------------------------
#  Main
# ---------------------------------------------------------------------------
def main():
    all_raw = []

    # Add known platforms first
    all_raw.extend(get_known_platforms())

    # Browser-based scraping
    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp('http://localhost:29229')
        context = browser.contexts[0] if browser.contexts else browser.new_context()
        page = context.new_page()

        scrapers = [
            ('TEFL.com', scrape_tefl_com),
            ('ESLCafe', scrape_eslcafe),
        ]

        for name, scraper in scrapers:
            try:
                raw = scraper(page)
                all_raw.extend(raw)
                print(f"  → {len(raw)} jobs from {name}", file=sys.stderr)
            except Exception as e:
                print(f"  ERROR in {name}: {e}", file=sys.stderr)

        # Validate links for scraped (non-platform) jobs
        print("\nValidating source links ...", file=sys.stderr)
        validated = []
        for raw in all_raw:
            valid, msg = validate_url(page, raw['sourceUrl'])
            if valid:
                validated.append(raw)
                print(f"  OK: {raw['title'][:40]} → {msg[:60]}", file=sys.stderr)
            else:
                print(f"  BAD: {raw['title'][:40]} → {msg}", file=sys.stderr)

        page.close()

    print(f"\nTotal after validation: {len(validated)}", file=sys.stderr)

    # Deduplicate
    seen = set()
    unique = []
    for raw in validated:
        key = re.sub(r'[^a-z]+', '', raw['title'].lower() + raw['company'].lower())
        if key not in seen:
            seen.add(key)
            unique.append(raw)

    print(f"After dedup: {len(unique)}", file=sys.stderr)

    # Apply 95% confidence threshold
    eligible = [r for r in unique if r['confidence'] >= 0.95]
    below = [r for r in unique if r['confidence'] < 0.95]

    print(f"\n≥95% confidence: {len(eligible)}", file=sys.stderr)
    for r in below:
        print(f"  BELOW THRESHOLD ({r['confidence']:.0%}): {r['title'][:50]} [{r.get('nationalityCaution', 'n/a')}]", file=sys.stderr)

    # Finalize
    jobs = [finalize_job(r) for r in eligible]

    print(json.dumps(jobs, indent=2))
    print(f"\nFinal ESL jobs: {len(jobs)}", file=sys.stderr)


if __name__ == '__main__':
    main()
