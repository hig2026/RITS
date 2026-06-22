#!/usr/bin/env python3
"""RITS Employer Vetter - Stage 2. Reads GAPI env var.
Usage:
    export GAPI=your-key
    python scripts/vet.py --stale
    python scripts/vet.py --employer learnlight
    python scripts/vet.py --input filtered.json
    python scripts/vet.py --dry-run
"""
import argparse, json, os, re, sys
from datetime import date, datetime, timedelta
from pathlib import Path

try:
    import google.generativeai as genai
except ImportError:
    print("ERROR: pip install google-generativeai", file=sys.stderr); sys.exit(1)

SCRIPTS_DIR = Path(__file__).parent
SOURCES_FILE = SCRIPTS_DIR / 'sources.json'
CACHE_DIR    = SCRIPTS_DIR / 'employer-cache'
VET_LOG      = SCRIPTS_DIR / 'vet-log.json'
CANDIDATES   = SCRIPTS_DIR / 'candidates.json'
CACHE_DIR.mkdir(exist_ok=True)

RUBRIC = """You are a senior employment vetter for RITS - a jobs board with two inviolable rules:
  a) Every listing must be open to ALL nationalities via worldwide remote OR visa sponsorship.
  b) Every listing must be in: ESL tutoring, AI training/annotation, English writing/editing, or analytics/data science.

Return ONLY valid JSON with these exact fields:
{
  "passes": true/false,
  "confidence": 0.0-1.0,
  "exclusionReason": null or "string",
  "payDisparityWarning": null or "string",
  "taskQualityWarning": null or "string",
  "regionalPayWarning": null or "string",
  "credibilityNotes": ["note1", "note2"],
  "hiringTendencyNote": "nationality/eligibility summary for Indian applicants",
  "estimatedHourlyRate": "e.g. $8-15/hr",
  "requiresEscalation": false,
  "escalationReason": null or "string"
}

Hard-exclude if: native-only confirmed, India geo-blocked, >50% pay gap, confirmed scam, <$1/hr effective.
Set requiresEscalation=true if confidence <0.80 or evidence conflicts.
Always address India eligibility in hiringTendencyNote."""


def load_log():
    if VET_LOG.exists():
        return json.load(open(VET_LOG))
    return {"totalCalls": 0, "totalPromptTokens": 0, "totalOutputTokens": 0,
            "estimatedCostUsdIfPaid": 0.0, "freeTierDailyRequestLimit": 1500, "runs": []}

def save_log(log):
    json.dump(log, open(VET_LOG, 'w'), indent=2)

def record_tokens(log, model, p, o):
    log['totalCalls'] += 1
    log['totalPromptTokens'] += p
    log['totalOutputTokens'] += o
    rate = (0.075, 0.30) if 'flash' in model else (1.25, 10.00)
    cost = round(p / 1e6 * rate[0] + o / 1e6 * rate[1], 6)
    log['estimatedCostUsdIfPaid'] = round(log['estimatedCostUsdIfPaid'] + cost, 6)
    return cost

def cache_path(eid):
    return CACHE_DIR / f"{re.sub(r'[^a-z0-9-]', '-', eid.lower())}.json"

def load_cached(eid, refresh_days):
    p = cache_path(eid)
    if not p.exists(): return None
    c = json.load(open(p))
    age = (date.today() - datetime.fromisoformat(c.get('lastVetted', '2000-01-01')).date()).days
    if age < refresh_days:
        print(f"  CACHE HIT ({age}d): {eid}", file=sys.stderr); return c
    print(f"  STALE ({age}d): {eid}", file=sys.stderr); return None

def save_cached(eid, result):
    p = cache_path(eid)
    existing = json.load(open(p)) if p.exists() else {}
    history = existing.get('vetHistory', [])
    if existing.get('confidence'):
        history.append({'date': existing.get('lastVetted'), 'confidence': existing['confidence']})
    result['vetHistory'] = history
    result['lastVetted'] = date.today().isoformat()
    result['nextVetDue'] = (date.today() + timedelta(days=30)).isoformat()
    json.dump(result, open(p, 'w'), indent=2)
    print(f"  CACHED: {p.name}", file=sys.stderr)

def call_gemini(company, job_text, model_name, api_key, log):
    genai.configure(api_key=api_key)
    prompt = f"COMPANY: {company}\n\nJOB TEXT:\n{job_text[:3200]}\n\nReturn the vetting JSON now."
    try:
        tools = 'google_search' if 'flash' in model_name else None
        kwargs = {'tools': tools} if tools else {}
        model = genai.GenerativeModel(model_name, system_instruction=RUBRIC, **kwargs)
        resp = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type='application/json', temperature=0.1, max_output_tokens=512
            )
        )
        u = resp.usage_metadata
        cost = record_tokens(log, model_name, u.prompt_token_count, u.candidates_token_count)
        print(f"    {u.prompt_token_count}+{u.candidates_token_count} tokens (${cost:.5f})", file=sys.stderr)
        r = json.loads(resp.text)
        r['_model'] = model_name
        return r
    except Exception as e:
        print(f"    ERROR: {e}", file=sys.stderr); return None

def vet_candidate(candidate, sources, api_key, log):
    company = candidate.get('company', candidate.get('id', 'unknown'))
    eid = candidate.get('id', re.sub(r'[^a-z0-9]+', '-', company.lower()))
    refresh_days = sources['vetConfig']['refreshIntervalDays']
    print(f"\nVetting: {company}", file=sys.stderr)
    cached = load_cached(eid, refresh_days)
    if cached: return cached
    job_text = candidate.get('bodyText', '') or f"Platform: {company}. URL: {candidate.get('sourceUrl', '')}"
    result = call_gemini(company, job_text, 'gemini-2.0-flash', api_key, log)
    if not result: return None
    if result.get('requiresEscalation'):
        print(f"  ESCALATING: {result.get('escalationReason', '')}", file=sys.stderr)
        pro = call_gemini(company, job_text, 'gemini-2.5-pro', api_key, log)
        if pro: result = pro; result['_escalated'] = True
    result.update({'company': company, 'canonicalId': eid,
                   'sourceUrl': candidate.get('sourceUrl', ''),
                   'domain': candidate.get('category', candidate.get('domain', ''))})
    save_cached(eid, result)
    return result

def get_stale(sources):
    rd = sources['vetConfig']['refreshIntervalDays']
    stale = []
    for f in CACHE_DIR.glob('*.json'):
        c = json.load(open(f))
        age = (date.today() - datetime.fromisoformat(c.get('lastVetted', '2000-01-01')).date()).days
        if age >= rd:
            stale.append({'id': c.get('canonicalId', f.stem), 'company': c.get('company', f.stem),
                          'sourceUrl': c.get('sourceUrl', ''), 'bodyText': ''})
    return stale

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input', '-i')
    p.add_argument('--employer', '-e')
    p.add_argument('--stale', action='store_true')
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    api_key = os.environ.get('GAPI')
    if not api_key and not args.dry_run:
        print("ERROR: GAPI env var not set.", file=sys.stderr); sys.exit(1)
    sources = json.load(open(SOURCES_FILE))
    log = load_log()
    if args.employer:
        candidates = [{'id': args.employer, 'company': args.employer, 'bodyText': ''}]
    elif args.stale:
        candidates = get_stale(sources)
        print(f"Stale employers: {len(candidates)}", file=sys.stderr)
    elif args.input:
        candidates = json.load(open(args.input))
    else:
        candidates = json.load(sys.stdin)
    if args.dry_run:
        print(f"DRY RUN - would vet {len(candidates)}:")
        for c in candidates: print(f"  - {c.get('company', c.get('id', '?'))}")
        return
    results = [vet_candidate(c, sources, api_key, log) for c in candidates]
    results = [r for r in results if r]
    log['runs'].append({'date': date.today().isoformat(), 'vetted': len(results),
                        'passed': sum(1 for r in results if r.get('passes'))})
    save_log(log)
    passing = [r for r in results if r.get('passes')]
    existing = json.load(open(CANDIDATES)) if CANDIDATES.exists() else []
    idx = {c['canonicalId']: i for i, c in enumerate(existing)}
    for r in passing:
        cid = r.get('canonicalId')
        if cid in idx: existing[idx[cid]] = r
        else: existing.append(r)
    json.dump(existing, open(CANDIDATES, 'w'), indent=2)
    print(f"\nDone: {len(results)} vetted, {len(passing)} passed", file=sys.stderr)
    print(f"Tokens: {log['totalPromptTokens']}+{log['totalOutputTokens']}, ${log['estimatedCostUsdIfPaid']:.4f} if paid", file=sys.stderr)

if __name__ == '__main__':
    main()
