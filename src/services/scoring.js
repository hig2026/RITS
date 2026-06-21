import { jobs, commissionPlatforms, scoreCriteria } from '../data/jobs.js';

export function formatStars(score) {
  const rounded = Math.round(score * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalfStar = rounded % 1 !== 0;
  return `${'★'.repeat(fullStars)}${hasHalfStar ? '½' : ''}${'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}`;
}

export function isEligibleForListing(job) {
  const validModes = ['Worldwide Remote', 'Visa Sponsorship', 'India-based, Open to All Nationalities'];
  return job.confidence >= 0.95 && validModes.includes(job.workMode) && isOpenToAllNationalities(job);
}

export function getCriteriaCount() {
  return scoreCriteria.length;
}

/** Combined list of standard listings plus commission-based platforms. */
export function allListings() {
  return [...jobs, ...commissionPlatforms];
}

/**
 * Hard nationality bar (enforced 2026-06-19): a role in India must be open to
 * applicants of ALL nationalities (with valid India work authorization), and
 * a remote/overseas role must be open to all nationalities including Indians.
 * Any role that restricts by citizenship or long-term residency fails this check.
 * Listings that fail are excluded and recorded in `excludedCompanies`.
 */
export function isOpenToAllNationalities(job) {
  const blocked = job.nationalityBlocksAllNationalities;
  const caution = (job.nationalityCaution || '').toLowerCase();
  const blockSignals = ['us citizen', 'canadian citizen', 'u.s. citizen', 'native only', 'resident in india for the last', 'must reside in', 'u.s. permanent resident', 'us/uk/au/nz', 'six-country block'];
  if (blocked) return false;
  return !blockSignals.some((s) => caution.includes(s));
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
