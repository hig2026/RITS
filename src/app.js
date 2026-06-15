import { jobs } from './data/jobs.js';
import { formatStars, isEligibleForListing } from './services/scoring.js';

const eligibleJobs = jobs.filter(isEligibleForListing);

const categoryFilter = document.querySelector('#category-filter');
const modeFilter = document.querySelector('#mode-filter');
const scoreFilter = document.querySelector('#score-filter');
const jobsGrid = document.querySelector('#jobs-grid');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');

function safeUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return parsed.href;
  } catch { /* invalid URL */ }
  return '#';
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildJobCard(job) {
  const article = el('article', 'job-card');

  const topline = el('div', 'job-card__topline');
  topline.append(
    el('span', 'pill', job.category),
    el('span', 'confidence', `${Math.round(job.confidence * 100)}% confidence`)
  );

  const scoreDiv = el('div', 'score');
  scoreDiv.setAttribute('aria-label', `Company credibility score ${job.score} out of 5`);
  scoreDiv.append(
    el('strong', null, job.score.toFixed(1)),
    el('span', null, formatStars(job.score))
  );

  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = 'Credibility notes';
  const notesList = document.createElement('ul');
  job.credibilityNotes.forEach((note) => notesList.append(el('li', null, note)));
  details.append(summary, notesList);

  const tagsDiv = el('div', 'tags');
  job.tags.forEach((tag) => tagsDiv.append(el('span', null, tag)));

  const metaRow = el('div', 'meta-row');
  metaRow.append(el('span', null, job.workMode), el('span', null, job.pay));

  const actions = el('div', 'job-actions');
  const sourceLink = el('a', 'button primary', 'View JD source');
  sourceLink.href = safeUrl(job.sourceUrl);
  sourceLink.target = '_blank';
  sourceLink.rel = 'noopener noreferrer';
  const companyLink = el('a', 'button secondary', 'Company site');
  companyLink.href = safeUrl(job.companyUrl);
  companyLink.target = '_blank';
  companyLink.rel = 'noopener noreferrer';
  actions.append(sourceLink, companyLink);

  article.append(
    topline,
    el('h3', null, job.title),
    el('p', 'company', job.company),
    metaRow,
    el('p', null, job.eligibility),
    scoreDiv,
    details,
    tagsDiv,
    actions,
    el('p', 'verified', `Verified ${job.verifiedOn}`)
  );

  return article;
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

  const filteredJobs = eligibleJobs.filter((job) => {
    const categoryMatch = selectedCategory === 'all' || job.category === selectedCategory;
    const modeMatch = selectedMode === 'all' || job.workMode === selectedMode;
    const scoreMatch = job.score >= minScore;
    return categoryMatch && modeMatch && scoreMatch;
  });

  jobsGrid.replaceChildren();
  emptyState.hidden = filteredJobs.length > 0;
  resultCount.textContent = `${filteredJobs.length} verified ${filteredJobs.length === 1 ? 'role' : 'roles'}`;

  filteredJobs.forEach((job) => jobsGrid.append(buildJobCard(job)));
}

populateCategories();
renderJobs();

[categoryFilter, modeFilter, scoreFilter].forEach((filter) => {
  filter.addEventListener('change', renderJobs);
});
