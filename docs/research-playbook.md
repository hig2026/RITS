# RITS job-vetting playbook

RITS only lists jobs when the reviewer can defend a **95% or higher confidence** that an Indian national can apply from India or from another country without being rejected for nationality/location reasons — and without facing documented pay discrimination.

## Inclusion rules

1. **Worldwide remote OR visa sponsorship OR direct-employer India role.** A worldwide-remote listing (worldwide, anywhere, global, no location restriction, or a country list including India) qualifies. A direct-employer India role (domestic India hiring at an India office) also qualifies as accessible to Indian nationals — provided the JD is verifiable on the company's own careers site. "Remote" alone is not enough when the employer also names the US, EU, UK, Canada, or a specific timezone as a hard location.
2. **Real job-description URL — never an aggregator search-results page.** The source link must point to the actual JD on the company's own careers site (or, for marketplaces, the official "teach"/"apply" page). ZipRecruiter job-search URLs, WeWorkRemotely category pages, and TEFL.com / Dave's ESL Cafe board listing pages are NOT acceptable — the reviewer must click through to the real company JD before listing. JS-rendered careers pages (Aon, Verisk Oracle HCM) are acceptable when the URL resolves in a browser and is indexed by search engines.
3. **No silent pay discrimination.** Any documented native-vs-non-native pay gap greater than 10% must be flagged via `payDisparityWarning` (fixed-rate platforms) or `payGapFlag` (commission marketplaces) and surfaced prominently on the card. Listings with a structural >50% gap are kept only with a prominent warning; listings whose gap is structural and unfixable (e.g. Outlier's ~78-85% gap, Cambly's native-only policy, DataAnnotation's India block, Polly English's India exclusion, Ringle's US/UK-university requirement) are excluded entirely and recorded in `excludedCompanies` with the reason and source URL.
4. **Role focus:** Current scope is ESL tutoring, analytics/data science, AI training, AI agents, and AI development, plus insurance/reinsurance cat-modelling and analytics.

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
