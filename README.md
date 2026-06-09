# RITS — Rummage In The Scrummage

RITS is a no-signup, free-to-build job listings prototype for Indian nationals seeking globally accessible work in:

- ESL tutoring and related online teaching
- Analytics and data science
- AI training, AI agents, and AI development

The site is intentionally static so it can be built, deployed, and hosted for free with GitHub Pages, Cloudflare Pages, Netlify's free tier, or any static hosting provider.

## What is included

- A responsive landing page and job board (`index.html`, `src/styles.css`, `src/app.js`)
- Curated seed data with source links and confidence notes (`src/data/jobs.js`)
- A five-star credibility scoring model (`src/services/scoring.js`)
- A no-auth placeholder seam for future registrations (`src/services/auth.js`)
- A reviewer playbook for job eligibility and company-credibility research (`docs/research-playbook.md`)
- Built-in Node tests (`tests/scoring.test.js`)
- A committed GitHub Pages workflow for free public hosting (`.github/workflows/pages.yml`)

## Free stack

| Need | Free choice |
| --- | --- |
| Frontend | Plain HTML, CSS, JavaScript modules |
| Package/runtime | Node.js built-in test runner; no paid dependencies |
| Local server | `python3 -m http.server 4173` |
| Hosting | GitHub Pages, Cloudflare Pages free tier, or Netlify free tier |
| Data updates | Manual edits now; free GitHub Actions can be added later |
| Future storage | Supabase free tier, Cloudflare D1 free tier, or GitHub-backed JSON workflow |

## Run locally

Serve the source files directly:

```bash
npm start
```

Open <http://localhost:4173>.

Preview the production artifact exactly as GitHub Pages will receive it:

```bash
npm run preview
```

Open <http://127.0.0.1:4173/>.

## Test

```bash
npm test
```

```bash
npm run smoke
```

## Hosting

The app is ready for free GitHub Pages hosting through the committed workflow at `.github/workflows/pages.yml`. Push `main` or `master`, set Pages source to **GitHub Actions**, and the workflow publishes `dist/` to the `github-pages` environment. See [`docs/deployment.md`](docs/deployment.md) for the turnkey preview and deployment flow.

## Data model

Each job in `src/data/jobs.js` includes:

- job title, company, category, work mode, pay note, source URL, and company URL
- India/global eligibility rationale
- confidence score, where listed jobs must be `>= 0.9`
- five-star company credibility score
- short credibility notes and tags

## Curation policy

A job should only be listed when it is:

1. clearly worldwide remote, explicitly open to India, or explicitly visa-sponsorship friendly;
2. within ESL tutoring, analytics/data science, AI training, AI agents, or AI development;
3. supported by source links rather than copied long-form job descriptions; and
4. above the 90% confidence threshold after company and job-description review.

See [`docs/research-playbook.md`](docs/research-playbook.md) for the full reviewer workflow.

## Future registration structure

The current app does not collect personal data. `src/services/auth.js` reserves a small interface for future optional accounts, saved jobs, reviewer roles, and applicant notes. Any future registration should remain opt-in and preserve anonymous browsing as the default.
