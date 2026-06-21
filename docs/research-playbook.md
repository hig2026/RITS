# RITS job-vetting playbook

RITS only lists jobs when the reviewer can defend a **95% or higher confidence** that an Indian national can apply from India or from another country without being rejected for nationality/location reasons — and without facing documented pay discrimination.

## Inclusion rules

1. **Worldwide remote OR visa sponsorship OR India-based role open to all nationalities.** Three acceptable work modes:
   - *Worldwide remote* — the listing must say worldwide, anywhere, global, no location restriction, or a country list including India. Open to all nationalities including Indians.
   - *Visa sponsorship* — the employer explicitly mentions sponsorship, relocation support, work authorization support, or a history of sponsoring similar roles.
   - *India-based role open to all nationalities* — a direct-employer role at an India office of a multinational that does NOT restrict to Indian citizens. Applicants of any nationality with valid India work authorization must be eligible. Roles requiring "Resident in India for the last N years" or tied to India citizenship fail this bar.
   - "Remote" alone is not enough when the employer also names the US, EU, UK, Canada, or a specific timezone as a hard location.
2. **Real job-description URL — never an aggregator search-results page.** The source link must point to the actual JD on the company's own careers site (or, for marketplaces, the official "teach"/"apply" page). ZipRecruiter job-search URLs, WeWorkRemotely category pages, and TEFL.com / Dave's ESL Cafe board listing pages are NOT acceptable — the reviewer must click through to the real company JD before listing. JS-rendered careers pages (Aon, Verisk Oracle HCM) are acceptable when the URL resolves in a browser and is indexed by search engines.
3. **No silent pay discrimination.** Any documented native-vs-non-native pay gap greater than 10% must be flagged via `payDisparityWarning` (fixed-rate platforms) or `payGapFlag` (commission marketplaces) and surfaced prominently on the card. Listings with a structural >50% gap are kept only with a prominent warning; listings whose gap is structural and unfixable (e.g. Outlier's ~78-85% gap, Cambly's native-only policy, DataAnnotation's India block, Polly English's India exclusion, Ringle's US/UK-university requirement) are excluded entirely and recorded in `excludedCompanies` with the reason and source URL.
4. **All-nationalities bar (enforced 2026-06-19).** India-based roles must be open to applicants of ALL nationalities (with valid India work authorization), not India-citizen-only. Remote/overseas roles must be open to all nationalities including Indians. Any role that restricts by citizenship (e.g. "U.S. citizen, Canadian citizen, or U.S. permanent resident"), native-speaker status as a hiring gate, or long-term residency (e.g. "Resident in India for the last 5 consecutive years") fails this bar and is excluded — recorded in `excludedCompanies` with reason and source URL. The `isOpenToAllNationalities` helper encodes this check; the test suite asserts no current listing violates it.
5. **Local-language roles (enforced 2026-06-19).** A role requiring a local language (e.g. Hindi rater, Tamil speech project, French tutor) must be open to applicants of any nationality who have the requisite language ability — not gated by nationality, citizenship, or long-term residency. A role is excluded if its language requirement is bundled with a residency or citizenship requirement. The `languageRequirement.openToAllNationalitiesWithAbility` field records this on every role that has a language gate.
6. **India-role evidence of openness.** A role located in India (work mode `India-based, Open to All Nationalities`) must carry a `nationalityOpenEvidence` field with: (a) a verbatim quote of the employer's equal-opportunity policy that explicitly names `national origin` or `citizenship` as a protected class; (b) the source URL of that policy on the company's own site; (c) a one-sentence explanation. Without an EEO policy citation or a documented track record of hiring foreign nationals in India, the role fails the all-nationalities bar and is excluded.
7. **Role focus:** Current scope is ESL tutoring, analytics/data science, AI training, AI agents, and AI development, plus insurance/reinsurance cat-modelling and analytics.

## Credibility scoring

Every company starts at 3.0 stars and can move up or down in 0.1 increments across five equal-weight dimensions:

| Dimension | Positive signals | Negative signals |
| --- | --- | --- |
| Culture & safety | credible employee-review consistency, transparent manager expectations | harassment reports, high-pressure churn, bait-and-switch interviews |
| Work-life balance | async work, flexible schedules, realistic quotas | unpaid trial labor, unpredictable shifts, excessive surveillance |
| DEI & global access | accepts applicants from India/global south, inclusive language, accessible process | nationality ambiguity, “native-only” ESL language, hidden work-authorization screens |
| Mobility & growth | internal movement, training, repeat projects | dead-end task queues, no feedback, arbitrary account suspensions |
| Legal & pay hygiene | clear contracts, known payment rails, no major employee wage issues | wage lawsuits, delayed payments, opaque deductions |

## Reviewer workflow

1. Read the full job description and record hard location, nationality, timezone, and work-authorization constraints.
2. **Click through to the real JD.** If the source link is an aggregator (ZipRecruiter, WeWorkRemotely, TEFL.com board listing, ESLCafe board listing), do not list — click through to the actual company JD and link that instead.
3. Check the company careers site and at least two reputable external signals for **hiring-practice character**, not impressions. Press investigations (e.g. Inc.com, Analytics India Magazine), lawsuit filings, and regulatory actions outweigh Glassdoor stars.
4. Extract native-speaker and non-native-speaker pay rates with sources. Compute the gap. If gap > 10%, flag it. If gap > 50% and structural, exclude and record in `excludedCompanies`.
5. Search for employee-related litigation, wage-payment disputes, contractor misclassification claims, and regulatory actions.
6. Confirm the work mode: worldwide remote, visa sponsorship, or direct-employer India role. "Remote" with a US/EU/UK/Canada hard location does NOT qualify.
7. Assign a confidence score. Exclude the listing if confidence is below 95%.
8. Add a short credibility note that explains the inclusion decision, any applicant caution, and the pay-gap finding.
9. Re-verify active listings at least weekly because remote and AI-training jobs close quickly.

## Free-tool operating model

- **Build:** plain HTML, CSS, and JavaScript.
- **Local development:** Python's built-in `http.server` or any static file server.
- **Testing:** Node's built-in test runner.
- **Hosting:** GitHub Pages, Cloudflare Pages free tier, or Netlify free tier.
- **Data updates:** edit `src/data/jobs.js`; future automation can generate a pull request from a free scheduled GitHub Action.
