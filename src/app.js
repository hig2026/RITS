import { jobs } from './data/jobs.js';
import { formatStars, isEligibleForListing } from './services/scoring.js';

const eligibleJobs = jobs.filter(isEligibleForListing);

const categoryFilter = document.querySelector('#category-filter');
const modeFilter = document.querySelector('#mode-filter');
const scoreFilter = document.querySelector('#score-filter');
const searchInput = document.querySelector('#search-input');
const jobsGrid = document.querySelector('#jobs-grid');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const darkToggle = document.querySelector('#dark-toggle');

function esc(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

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

  const filteredJobs = eligibleJobs.filter((job) => {
    const categoryMatch = selectedCategory === 'all' || job.category === selectedCategory;
    const modeMatch = selectedMode === 'all' || job.workMode === selectedMode;
    const scoreMatch = job.score >= minScore;
    const textMatch = !query || [job.title, job.company, ...job.tags]
      .some((field) => field.toLowerCase().includes(query));
    return categoryMatch && modeMatch && scoreMatch && textMatch;
  });

  jobsGrid.innerHTML = '';
  emptyState.hidden = filteredJobs.length > 0;
  resultCount.textContent = `${filteredJobs.length} verified ${filteredJobs.length === 1 ? 'role' : 'roles'}`;

  filteredJobs.forEach((job) => {
    const article = document.createElement('article');
    article.className = 'job-card';
    const cautionHtml = job.nationalityCaution
      ? `<span class="caution-flag" title="${esc(job.nationalityCaution)}">⚠ ${esc(job.nationalityCaution)}</span>`
      : '';
    const hiringNote = job.hiringTendencyNote
      ? `<p class="hiring-note"><em>${esc(job.hiringTendencyNote)}</em></p>`
      : '';
    const platformBadge = job.platformWarning
      ? `<p class="platform-warning">${esc(job.platformWarning)}</p>`
      : '';
    const payDisparity = job.payDisparityWarning
      ? `<p class="pay-disparity-warning">⚠ Pay disparity: ${esc(job.payDisparityWarning)}</p>`
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
      ${platformBadge}
      ${payDisparity}
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
  });
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
