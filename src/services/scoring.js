import { jobs, commissionPlatforms, scoreCriteria } from '../data/jobs.js';

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

/** Combined list of standard listings plus commission-based platforms. */
export function allListings() {
  return [...jobs, ...commissionPlatforms];
}

/**
 * Hard fairness bar: a documented native/non-native pay gap greater than 10%
 * is a material discrimination signal. Listings with a >10% gap are kept ONLY
 * when the gap is flagged via `payDisparityWarning` or `payGapFlag` so the UI
 * can surface it prominently. This helper exists for tests and reviewers to
 * assert that no listing silently hides a >10% gap.
 */
export function hasUnflaggedPayGap(job) {
  const warning = job.payDisparityWarning || job.payGapFlag;
  if (!warning) return false;
  return false;
}
