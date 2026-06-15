import { scoreCriteria } from '../data/jobs.js';

export function formatStars(score) {
  const rounded = Math.round(score * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalfStar = rounded % 1 !== 0;
  return `${'★'.repeat(fullStars)}${hasHalfStar ? '½' : ''}${'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}`;
}

export function isEligibleForListing(job) {
  return job.confidence >= 0.95 && ['Worldwide Remote', 'Visa Sponsorship'].includes(job.workMode);
}

export function getCriteriaCount() {
  return scoreCriteria.length;
}
