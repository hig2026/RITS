import { jobs, commissionPlatforms, excludedCompanies } from './data/jobs.js';
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
const commissionPanel = document.querySelector('#commission-panel');
const commissionGrid = document.querySelector('#commission-grid');
const commissionToggle = document.querySelector('#commission-toggle');

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
    const textMatch = !query || [job.title, job.company, ...(job.tags || [])]
      .some((field) => field.toLowerCase().includes(query));
    return categoryMatch && modeMatch && scoreMatch && textMatch;
  });

  jobsGrid.innerHTML = '';
  emptyState.hidden = filteredJobs.length > 0;
  resultCount.textContent = `${filteredJobs.length} verified ${filteredJobs.length === 1 ? 'role' : 'roles'}`;

  filteredJobs.forEach((job) => jobsGrid.append(buildJobCard(job)));
}

function buildJobCard(job) {
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
  const regionalPay = job.regionalPayWarning
    ? `<p class="regional-warning">Note: ${esc(job.regionalPayWarning)}</p>`
    : '';
  const langReq = job.languageRequirement
    ? `<p class="lang-requirement"><strong>Language:</strong> ${esc(job.languageRequirement.language)} (${esc(job.languageRequirement.level)}) — open to all nationalities with the requisite ability. ${esc(job.languageRequirement.notes || '')}</p>`
    : '';
  const eeoEvidence = job.nationalityOpenEvidence
    ? `<details><summary>Equal-opportunity employer evidence</summary><blockquote>${esc(job.nationalityOpenEvidence.policy)}</blockquote><p><a href="${esc(job.nationalityOpenEvidence.sourceUrl)}" target="_blank" rel="noopener noreferrer">Source: official EEO policy</a></p><p>${esc(job.nationalityOpenEvidence.explanation)}</p></details>`
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
    ${langReq}
    ${hiringNote}
    ${platformBadge}
    ${payDisparity}
    ${regionalPay}
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
    ${eeoEvidence}
    <div class="tags">${job.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>
    <div class="job-actions">
      <a class="button primary" href="${esc(job.sourceUrl)}" target="_blank" rel="noopener noreferrer">View JD</a>
      <a class="button secondary" href="${esc(job.companyUrl)}" target="_blank" rel="noopener noreferrer">Company site</a>
    </div>
    <p class="verified">Verified ${esc(job.verifiedOn)}</p>
  `;
  return article;
}

function buildCommissionCard(p) {
  const article = document.createElement('article');
  article.className = 'job-card commission-card';
  const payGap = p.payGapFlag
    ? `<p class="pay-disparity-warning">⚠ Pay gap: ${esc(p.payGapFlag)}</p>`
    : '';
  article.innerHTML = `
    <div class="job-card__topline">
      <span class="pill">Commission marketplace</span>
      <span class="confidence">${Math.round(p.confidence * 100)}% confidence</span>
    </div>
    <h3>${esc(p.title)}</h3>
    <p class="company">${esc(p.company)}</p>
    <div class="meta-row">
      <span>${esc(p.workMode)}</span>
      <span>${esc(p.pay)}</span>
    </div>
    <p>${esc(p.eligibility)}</p>
    ${payGap}
    <div class="score" aria-label="Company credibility score ${p.score} out of 5">
      <strong>${p.score.toFixed(1)}</strong>
      <span>${formatStars(p.score)}</span>
    </div>
    <details>
      <summary>Vetting notes</summary>
      <ul>
        ${p.credibilityNotes.map((note) => `<li>${esc(note)}</li>`).join('')}
      </ul>
    </details>
    <div class="tags">${p.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>
    <div class="job-actions">
      <a class="button primary" href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">Apply / Teach</a>
      <a class="button secondary" href="${esc(p.companyUrl)}" target="_blank" rel="noopener noreferrer">Company site</a>
    </div>
    <p class="verified">Verified ${esc(p.verifiedOn)}</p>
  `;
  return article;
}

function renderCommission() {
  commissionGrid.innerHTML = '';
  commissionPlatforms.forEach((p) => commissionGrid.append(buildCommissionCard(p)));
}

function toggleCommission() {
  const open = commissionPanel.hidden;
  commissionPanel.hidden = !open;
  commissionToggle.textContent = open ? 'Hide commission platforms' : `Show ${commissionPlatforms.length} commission platforms`;
  commissionToggle.setAttribute('aria-expanded', String(open));
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
  // Dark is the site default. Respect an explicit stored choice; otherwise always dark.
  applyTheme(saved ? saved === 'dark' : true);
}

darkToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark);
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === '/' || e.key === 's') { e.preventDefault(); searchInput.focus(); }
  if (e.key === 'd') { darkToggle.click(); }
});

let debounceTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(renderJobs, 180);
});

commissionToggle.addEventListener('click', toggleCommission);

populateCategories();
initTheme();
renderJobs();
renderCommission();
// Initial toggle label — set once here; toggleCommission() owns all subsequent writes.
commissionToggle.textContent = `Show ${commissionPlatforms.length} commission platforms`;

[categoryFilter, modeFilter, scoreFilter].forEach((filter) => {
  filter.addEventListener('change', renderJobs);
});
