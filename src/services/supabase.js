/**
 * Supabase client for fetching scraped jobs from the database.
 * Falls back to static jobs.js data if Supabase is unreachable.
 */

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

/**
 * Fetch active scraped jobs from Supabase.
 * Returns array of job objects in the same shape as src/data/jobs.js entries,
 * or empty array if Supabase is not configured or unreachable.
 */
export async function fetchScrapedJobs() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const url = `${SUPABASE_URL}/rest/v1/scraped_jobs?is_active=eq.true&order=score.desc,first_seen.desc&limit=100`;
    const resp = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!resp.ok) return [];

    const rows = await resp.json();
    return rows.map(rowToJob);
  } catch {
    return [];
  }
}

/**
 * Fetch the most recent scrape run for the "last updated" indicator.
 */
export async function fetchLastScrapeRun() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const url = `${SUPABASE_URL}/rest/v1/scrape_runs?order=started_at.desc&limit=1`;
    const resp = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!resp.ok) return null;

    const rows = await resp.json();
    return rows[0] || null;
  } catch {
    return null;
  }
}

function rowToJob(row) {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  const notes = [];
  if (row.jd_summary) notes.push(row.jd_summary);
  notes.push(`Source: scraped from ${row.source_board_id || 'job board'}.`);
  if (row.nationality_caution) notes.push(`Nationality note: ${row.nationality_caution}`);
  notes.push('Verify pay, contract terms, and payment methods directly with the employer.');

  return {
    id: row.id || `scraped-${row.content_hash?.slice(0, 12) || Date.now()}`,
    title: row.title || 'Untitled',
    company: row.company || 'Unknown',
    category: row.category || 'General Remote',
    workMode: row.work_mode || 'Worldwide Remote',
    eligibility: row.jd_summary
      ? row.jd_summary
      : `Scraped listing from ${row.source_board_id || 'job board'}. Passed global-accessibility filter.`,
    confidence: row.confidence || 0.9,
    score: row.score || 3.0,
    pay: row.pay || 'Check source listing for current rate',
    sourceUrl: row.source_url || '#',
    companyUrl: row.company_url || '',
    verifiedOn: row.verified_on || row.last_seen?.slice(0, 10) || '',
    credibilityNotes: notes,
    tags: tags.length ? tags : ['Scraped', 'Remote'],
    nationalityCaution: row.nationality_caution || null,
    hiringTendencyNote: null,
    platformWarning: null,
    payDisparityWarning: null,
    regionalPayWarning: null,
    languageRequirement: null,
    nationalityOpenEvidence: null,
    isScraped: true,
  };
}
