import { jobs } from './data/jobs.js';
import { formatStars, formatConfidence, isEligibleForListing } from './services/scoring.js';
import { renderListItems, renderTags, externalLink } from './helpers/dom.js';

const eligibleJobs = jobs.filter(isEligibleForListing);

const categoryFilter = document.querySelector('#category-filter');
const modeFilter = document.querySelector('#mode-filter');
const scoreFilter = document.querySelector('#score-filter');
const jobsGrid = document.querySelector('#jobs-grid');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');

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

  jobsGrid.innerHTML = '';
  emptyState.hidden = filteredJobs.length > 0;
  resultCount.textContent = `${filteredJobs.length} verified ${filteredJobs.length === 1 ? 'role' : 'roles'}`;

  filteredJobs.forEach((job) => {
    const article = document.createElement('article');
    article.className = 'job-card';
    article.innerHTML = `
      <div class="job-card__topline">
        <span class="pill">${job.category}</span>
        <span class="confidence">${formatConfidence(job.confidence)} confidence</span>
      </div>
      <h3>${job.title}</h3>
      <p class="company">${job.company}</p>
      <div class="meta-row">
        <span>${job.workMode}</span>
        <span>${job.pay}</span>
      </div>
      <p>${job.eligibility}</p>
      <div class="score" aria-label="Company credibility score ${job.score} out of 5">
        <strong>${job.score.toFixed(1)}</strong>
        <span>${formatStars(job.score)}</span>
      </div>
      <details>
        <summary>Credibility notes</summary>
        <ul>
          ${renderListItems(job.credibilityNotes)}
        </ul>
      </details>
      <div class="tags">
        ${renderTags(job.tags)}
      </div>
      <div class="job-actions">
        ${externalLink(job.sourceUrl, 'View JD source', 'button primary')}
        ${externalLink(job.companyUrl, 'Company site', 'button secondary')}
      </div>
      <p class="verified">Verified ${job.verifiedOn}</p>
    `;
    jobsGrid.append(article);
  });
}

populateCategories();
renderJobs();

[categoryFilter, modeFilter, scoreFilter].forEach((filter) => {
  filter.addEventListener('change', renderJobs);
});
