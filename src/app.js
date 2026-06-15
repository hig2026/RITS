import { jobs } from './data/jobs.js';
import { formatStars, isEligibleForListing } from './services/scoring.js';

const REQUIRED_JOB_FIELDS = [
  'title', 'company', 'category', 'workMode', 'confidence',
  'score', 'pay', 'sourceUrl', 'companyUrl', 'eligibility',
  'verifiedOn', 'credibilityNotes', 'tags',
];

function requireElement(selector) {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`Required DOM element not found: ${selector}`);
  }
  return el;
}

function esc(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function validateJob(job, index) {
  const missing = REQUIRED_JOB_FIELDS.filter((field) => job[field] == null);
  if (missing.length > 0) {
    throw new Error(
      `Job at index ${index} (${job.id ?? 'unknown'}) is missing fields: ${missing.join(', ')}`,
    );
  }
  if (!Array.isArray(job.credibilityNotes)) {
    throw new TypeError(
      `Job "${job.id ?? index}": credibilityNotes must be an array`,
    );
  }
  if (!Array.isArray(job.tags)) {
    throw new TypeError(`Job "${job.id ?? index}": tags must be an array`);
  }
}

function showFatalError(message) {
  const grid = document.querySelector('#jobs-grid');
  if (grid) {
    grid.innerHTML = `<p class="empty-state" role="alert">${message}</p>`;
  }
  const count = document.querySelector('#result-count');
  if (count) {
    count.textContent = '';
  }
}

function init() {
  const categoryFilter = requireElement('#category-filter');
  const modeFilter = requireElement('#mode-filter');
  const scoreFilter = requireElement('#score-filter');
  const searchInput = requireElement('#search-input');
  const jobsGrid = requireElement('#jobs-grid');
  const resultCount = requireElement('#result-count');
  const emptyState = requireElement('#empty-state');
  const darkToggle = requireElement('#dark-toggle');

  const eligibleJobs = jobs.filter((job, i) => {
    try {
      return isEligibleForListing(job);
    } catch (err) {
      console.error(`Skipping job at index ${i} during eligibility check:`, err);
      return false;
    }
  });

  function populateCategories() {
    const categories = [...new Set(eligibleJobs.map((job) => job.category))].sort();

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.append(option);
    });
  }

  function renderJobs() {
    const selectedCategory = categoryFilter.value;
    const selectedMode = modeFilter.value;
    const minScore = Number(scoreFilter.value);
    const query = (searchInput.value || '').toLowerCase().trim();

    if (Number.isNaN(minScore)) {
      console.error('Score filter produced NaN; defaulting to 0');
    }
    const safeMinScore = Number.isNaN(minScore) ? 0 : minScore;

    const filteredJobs = eligibleJobs.filter((job) => {
      const categoryMatch = selectedCategory === 'all' || job.category === selectedCategory;
      const modeMatch = selectedMode === 'all' || job.workMode === selectedMode;
      const scoreMatch = job.score >= safeMinScore;
      const textMatch = !query || [job.title, job.company, ...job.tags]
        .some((field) => field.toLowerCase().includes(query));
      return categoryMatch && modeMatch && scoreMatch && textMatch;
    });

    jobsGrid.innerHTML = '';
    emptyState.hidden = filteredJobs.length > 0;
    resultCount.textContent = `${filteredJobs.length} verified ${filteredJobs.length === 1 ? 'role' : 'roles'}`;

    let renderErrors = 0;

    filteredJobs.forEach((job, i) => {
      try {
        validateJob(job, i);

        const article = document.createElement('article');
        article.className = 'job-card';
        const cautionHtml = job.nationalityCaution
          ? `<span class="caution-flag" title="${esc(job.nationalityCaution)}">⚠ ${esc(job.nationalityCaution)}</span>`
          : '';
        const hiringNote = job.hiringTendencyNote
          ? `<p class="hiring-note"><em>${esc(job.hiringTendencyNote)}</em></p>`
          : '';
        article.innerHTML = `
          <div class="job-card__topline">
            <span class="pill">${esc(job.category)}</span>
            <span class="confidence">${Math.round(job.confidence * 100)}% confidence${cautionHtml}</span>
          </div>
          <h3>${esc(job.title)}</h3>
          <p class="company">${esc(job.company)}</p>
          <div class="meta-row">
            <span>${esc(job.workMode)}</span>
            <span>${esc(job.pay)}</span>
          </div>
          <p>${esc(job.eligibility)}</p>
          ${hiringNote}
          <div class="score" aria-label="Company credibility score ${job.score} out of 5">
            <strong>${job.score.toFixed(1)}</strong>
            <span>${formatStars(job.score)}</span>
          </div>
          <details>
            <summary>Credibility notes</summary>
            <ul>
              ${job.credibilityNotes.map((note) => `<li>${esc(note)}</li>`).join('')}
            </ul>
          </details>
          <div class="tags">
            ${job.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}
          </div>
          <div class="job-actions">
            <a class="button primary" href="${esc(job.sourceUrl)}" target="_blank" rel="noopener noreferrer">View JD</a>
            <a class="button secondary" href="${esc(job.companyUrl)}" target="_blank" rel="noopener noreferrer">Company site</a>
          </div>
          <p class="verified">Verified ${esc(job.verifiedOn)}</p>
        `;
        jobsGrid.append(article);
      } catch (err) {
        renderErrors += 1;
        console.error(`Failed to render job card "${job.id ?? i}":`, err);
      }
    });

    if (renderErrors > 0) {
      resultCount.textContent += ` (${renderErrors} could not be displayed)`;
    }
  }

  /* --- Dark mode toggle --- */
  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    darkToggle.textContent = dark ? '☀️' : '🌙';
    darkToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    try { localStorage.setItem('rits-theme', dark ? 'dark' : 'light'); } catch { /* noop */ }
  }

  function initTheme() {
    let saved;
    try { saved = localStorage.getItem('rits-theme'); } catch { /* noop */ }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved ? saved === 'dark' : prefersDark);
  }

  darkToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
  });

  /* --- Keyboard shortcuts --- */
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === '/' || e.key === 's') { e.preventDefault(); searchInput.focus(); }
    if (e.key === 'd') { darkToggle.click(); }
  });

  /* --- Debounced search --- */
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderJobs, 180);
  });

  populateCategories();
  initTheme();
  renderJobs();

  [categoryFilter, modeFilter, scoreFilter].forEach((filter) => {
    filter.addEventListener('change', renderJobs);
  });
}

try {
  init();
} catch (err) {
  console.error('RITS failed to initialize:', err);
  showFatalError(
    'Something went wrong while loading the job board. Check the browser console for details.',
  );
}
