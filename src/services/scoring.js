import { scoreCriteria } from '../data/jobs.js';

export function formatStars(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) {
    throw new TypeError(`formatStars: expected a number, got ${String(score)}`);
  }
  const clamped = Math.max(0, Math.min(5, score));
  const rounded = Math.round(clamped * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalfStar = rounded % 1 !== 0;
  return `${'★'.repeat(fullStars)}${hasHalfStar ? '½' : ''}${'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}`;
}

export function isEligibleForListing(job) {
  if (job == null || typeof job !== 'object') {
    throw new TypeError('isEligibleForListing: expected a job object');
  }
  if (typeof job.confidence !== 'number' || typeof job.workMode !== 'string') {
    return false;
  }
  return job.confidence >= 0.95 && ['Worldwide Remote', 'Visa Sponsorship'].includes(job.workMode);
}

export function getCriteriaCount() {
  if (!Array.isArray(scoreCriteria)) {
    throw new TypeError('getCriteriaCount: scoreCriteria is not an array');
  }
  return scoreCriteria.length;
}
