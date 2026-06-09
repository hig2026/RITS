# RITS job-vetting playbook

RITS only lists jobs when the reviewer can defend a **90% or higher confidence** that an Indian national can apply from India or from another country without being rejected for nationality/location reasons.

## Inclusion rules

1. **Worldwide remote:** The listing must say worldwide, anywhere, global, no location restriction, or provide a country list that includes India.
2. **Visa sponsorship:** The employer must explicitly mention sponsorship, relocation support, work authorization support, or a history of sponsoring similar roles in the target country.
3. **No unclear remote geography:** “Remote” alone is not enough when the employer also names the US, EU, UK, Canada, or a specific timezone as a hard location.
4. **Role focus:** Current scope is ESL tutoring, analytics/data science, AI training, AI agents, and AI development.
5. **Source link:** RITS links to the original job description or source page instead of copying long copyrighted descriptions.

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
2. Check the company careers site and at least two reputable external signals for hiring practices and worker sentiment.
3. Search for employee-related litigation, wage-payment disputes, contractor misclassification claims, and regulatory actions.
4. Assign a confidence score. Exclude the listing if confidence is below 90%.
5. Add a short credibility note that explains the inclusion decision and any applicant caution.
6. Re-verify active listings at least weekly because remote and AI-training jobs close quickly.

## Free-tool operating model

- **Build:** plain HTML, CSS, and JavaScript.
- **Local development:** Python's built-in `http.server` or any static file server.
- **Testing:** Node's built-in test runner.
- **Hosting:** GitHub Pages, Cloudflare Pages free tier, or Netlify free tier.
- **Data updates:** edit `src/data/jobs.js`; future automation can generate a pull request from a free scheduled GitHub Action.
