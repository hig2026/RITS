#!/usr/bin/env python3
"""RITS Rules Filter - Stage 1, zero LLM tokens.
Usage: python scripts/rules_filter.py --input scraped.json --output filtered.json
"""
import argparse, json, re, sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent
SOURCES_FILE = SCRIPTS_DIR / 'sources.json'

HARD_REJECT = [
    r'native (english )?speaker(s)? only',
    r'must be a (us|uk|eu|canadian|australian) citizen',
    r'(us|uk|eu|ca|au|nz) (citizens?|passport|nationals?) (only|required)',
    r'right to work in (the )?(uk|us|eu|australia|canada)',
    r'not available in india',
    r'india (not |is not |isn.t )(eligible|supported|accepted)',
    r'exclud(es?|ing) india',
]

CAUTION = [
    (r'native (english )?speaker preferred', 'Native speaker preference - verify non-native acceptance'),
    (r'accent neutrali[sz]ation required', 'Accent requirement - may disadvantage non-native speakers'),
    (r'right to work', 'Right to work clause - verify not a geo restriction'),
    (r'(us|uk|eu) (based|residents?)', 'Region mention - verify worldwide remote applies'),
]

DOMAIN_PATTERNS = [
    r'(esl|tefl|tesol|english (teacher|tutor|instructor|trainer|coach))',
    r'(online (teach|tutor|instruct))',
    r'(ai (trainer|training|data|annotation)|data annot|machine learning data)',
    r'(freelance (writ|edit|content|article|blog))',
    r'(analytics|data science|python developer)',
    r'(language (teach|tutor|instruct))',
]

ACCESS_PATTERNS = [
    r'worldwide remote', r'work from anywhere', r'all nationalities',
    r'non.native (speakers? )?(welcome|accepted|eligible|ok)',
    r'global remote', r'location independent', r'anywhere in the world',
    r'international applicants? (welcome|accepted)',
    r'(visa|work permit) (sponsorship|provided|available)',
    r'from any country',
]


def is_excluded(company, excluded_list):
    name = company.lower()
    for ex in excluded_list:
        if ex['id'].replace('-', ' ') in name or ex['company'].lower() in name:
            return ex
    return None


def apply_rules(candidate, excluded_list, threshold):
    text = (candidate.get('bodyText', '') + ' ' + candidate.get('title', '')).lower()
    company = candidate.get('company', '')
    flags, confidence = [], 0.95

    excl = is_excluded(company, excluded_list)
    if excl:
        return False, 0.0, [], f"Exclusion list: {excl['reason']}"

    hits = [p for p in HARD_REJECT if re.search(p, text)]
    if hits:
        return False, 0.1, hits, f"Hard reject: {hits[0]}"

    if not any(re.search(p, text) for p in DOMAIN_PATTERNS):
        cat = candidate.get('category', '').lower()
        sources = json.load(open(SOURCES_FILE))
        if not any(d.lower() in cat for d in sources['domains']):
            return False, 0.3, [], 'No domain match'

    if not any(re.search(p, text) for p in ACCESS_PATTERNS):
        if re.search(r'online (teach|tutor)', text):
            flags.append('Assumed worldwide - online teaching platform')
            confidence = min(confidence, 0.92)
        else:
            flags.append('No worldwide access signal - needs manual check')
            confidence = min(confidence, 0.80)

    for pattern, note in CAUTION:
        if re.search(pattern, text):
            flags.append(note)
            confidence = min(confidence, 0.88)

    return True, confidence, flags, None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', '-i')
    parser.add_argument('--output', '-o')
    args = parser.parse_args()

    candidates = json.load(open(args.input) if args.input else sys.stdin)
    sources = json.load(open(SOURCES_FILE))
    excluded_list = sources.get('excluded', [])
    threshold = sources['vetConfig']['confidenceThreshold']

    passed, rejected = [], []
    for c in candidates:
        passes, conf, flags, reason = apply_rules(c, excluded_list, threshold)
        if not passes:
            c['_rejectReason'] = reason
            rejected.append(c)
        elif conf < threshold:
            c['_rejectReason'] = f'Below threshold ({conf:.0%})'
            rejected.append(c)
        else:
            c['_rulesConfidence'] = conf
            c['_rulesFlags'] = flags
            passed.append(c)

    print(f"Rules: {len(candidates)} in => {len(passed)} passed, {len(rejected)} rejected", file=sys.stderr)
    for r in rejected:
        print(f"  REJECT: {r.get('company','?')} - {r['_rejectReason']}", file=sys.stderr)

    out = json.dumps(passed, indent=2)
    if args.output:
        open(args.output, 'w').write(out)
    else:
        print(out)


if __name__ == '__main__':
    main()
