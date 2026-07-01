/*
# Create scraped jobs cache schema

## Purpose
Persistent cache for the RITS intelligent scraper. Stores scraped job listings,
source board metadata, and scrape run history. On each scrape run, only NEW jobs
are added and EXPIRED jobs are marked inactive — enabling incremental sync.

## New Tables

### 1. source_boards
Stable job board entry points for scraping. Individual job links are ephemeral
but the board itself is a stable scraping source.
- id (text, PK) — slug identifier (e.g. 'himalayas', 'wwr')
- name (text) — display name
- url (text) — base URL to scrape
- board_type (text) — 'api' | 'scrape'
- api_url (text, nullable) — JSON API endpoint if board_type='api'
- category_focus (text) — what kinds of jobs this board covers
- notes (text) — scraping notes
- last_scraped (timestamptz, nullable) — last successful scrape time
- is_active (boolean, default true) — whether to include in scrape runs

### 2. scraped_jobs
Individual job listings pulled from source boards. Deduplicated by content_hash
so re-scraping the same job doesn't create duplicates.
- id (uuid, PK)
- source_board_id (text, FK → source_boards.id)
- title (text)
- company (text)
- category (text) — 'ESL Tutoring', 'Analytics/Data Science', 'AI Training', etc.
- work_mode (text) — 'Worldwide Remote', 'Visa Sponsorship', 'India-based', etc.
- source_url (text) — direct JD link
- company_url (text, nullable)
- jd_summary (text, nullable) — Gemini-generated summary of the JD
- jd_text (text, nullable) — raw JD text for re-processing
- confidence (real) — 0.0–1.0 global-accessibility confidence
- score (real) — 0–5 credibility score
- pay (text, nullable)
- tags (jsonb, default '[]')
- nationality_caution (text, nullable)
- content_hash (text, unique) — SHA256 of title+company+source_url for dedup
- is_active (boolean, default true) — false = expired/removed from source
- first_seen (timestamptz) — when first scraped
- last_seen (timestamptz) — last scrape run where this job was found
- gemini_processed (boolean, default false) — whether Gemini has summarized/classified
- verified_on (date, nullable)

### 3. scrape_runs
Audit log of each scrape execution.
- id (uuid, PK)
- started_at (timestamptz)
- finished_at (timestamptz, nullable)
- source_board_id (text, nullable) — null = all boards
- jobs_found (integer, default 0) — total jobs found this run
- jobs_added (integer, default 0) — new jobs inserted
- jobs_expired (integer, default 0) — jobs marked inactive
- jobs_unchanged (integer, default 0) — jobs already in DB, still active
- errors (jsonb, default '[]') — per-board error messages
- status (text) — 'running', 'completed', 'failed'

## Security
- RLS enabled on all tables.
- This is a no-auth public app (no sign-in screen). All policies use
  TO anon, authenticated with USING (true) / WITH CHECK (true) because
  the scraped job data is intentionally public/shared.
- The scraper writes via the service role key (bypasses RLS), and the
  frontend reads via the anon key (needs anon SELECT policy).

## Indexes
- scraped_jobs.content_hash — unique, for dedup lookups
- scraped_jobs.source_board_id — filter by board
- scraped_jobs.is_active — filter active jobs for frontend
- scraped_jobs.category — filter by category
- scrape_runs.started_at — recent runs first
*/

CREATE TABLE IF NOT EXISTS source_boards (
  id text PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  board_type text NOT NULL DEFAULT 'scrape',
  api_url text,
  category_focus text,
  notes text,
  last_scraped timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE source_boards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_source_boards" ON source_boards;
CREATE POLICY "anon_read_source_boards" ON source_boards FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_source_boards" ON source_boards;
CREATE POLICY "anon_insert_source_boards" ON source_boards FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_source_boards" ON source_boards;
CREATE POLICY "anon_update_source_boards" ON source_boards FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_source_boards" ON source_boards;
CREATE POLICY "anon_delete_source_boards" ON source_boards FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS scraped_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_board_id text REFERENCES source_boards(id) ON DELETE SET NULL,
  title text NOT NULL,
  company text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  work_mode text NOT NULL DEFAULT 'Worldwide Remote',
  source_url text NOT NULL,
  company_url text,
  jd_summary text,
  jd_text text,
  confidence real NOT NULL DEFAULT 0.5,
  score real NOT NULL DEFAULT 3.0,
  pay text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  nationality_caution text,
  content_hash text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  gemini_processed boolean NOT NULL DEFAULT false,
  verified_on date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scraped_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_scraped_jobs" ON scraped_jobs;
CREATE POLICY "anon_read_scraped_jobs" ON scraped_jobs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scraped_jobs" ON scraped_jobs;
CREATE POLICY "anon_insert_scraped_jobs" ON scraped_jobs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scraped_jobs" ON scraped_jobs;
CREATE POLICY "anon_update_scraped_jobs" ON scraped_jobs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scraped_jobs" ON scraped_jobs;
CREATE POLICY "anon_delete_scraped_jobs" ON scraped_jobs FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_scraped_jobs_content_hash ON scraped_jobs (content_hash);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_source_board ON scraped_jobs (source_board_id);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_is_active ON scraped_jobs (is_active);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_category ON scraped_jobs (category);

CREATE TABLE IF NOT EXISTS scrape_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  source_board_id text,
  jobs_found integer NOT NULL DEFAULT 0,
  jobs_added integer NOT NULL DEFAULT 0,
  jobs_expired integer NOT NULL DEFAULT 0,
  jobs_unchanged integer NOT NULL DEFAULT 0,
  errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'running'
);

ALTER TABLE scrape_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_scrape_runs" ON scrape_runs;
CREATE POLICY "anon_read_scrape_runs" ON scrape_runs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scrape_runs" ON scrape_runs;
CREATE POLICY "anon_insert_scrape_runs" ON scrape_runs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scrape_runs" ON scrape_runs;
CREATE POLICY "anon_update_scrape_runs" ON scrape_runs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scrape_runs" ON scrape_runs;
CREATE POLICY "anon_delete_scrape_runs" ON scrape_runs FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_scrape_runs_started ON scrape_runs (started_at DESC);
