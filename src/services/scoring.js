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
 * Returns true when a listing carries language in its credibilityNotes or pay
 * field that implies a native/non-native pay split, but neither
 * `payDisparityWarning` nor `payGapFlag` is populated.
 *
 * A true result means the listing has an unflagged gap — a data integrity
 * error that must be fixed before the listing is published.
 *
 * Rationale: the previous implementation always returned false, making the
 * corresponding test vacuous. This version inspects actual field content.
 */
export function hasUnflaggedPayGap(job) {
  const flagged = Boolean(job.payDisparityWarning) || Boolean(job.payGapFlag);
  if (flagged) return false; // gap is flagged — no problem

  // Look for split-pay language in the fields most likely to carry it.
  const haystack = [
    job.pay || '',
    ...(job.credibilityNotes || []),
  ].join(' ').toLowerCase();

  const splitSignals = [
    'native ~$', 'non-native ~$',
    'native speakers earn', 'non-native speakers earn',
    'native/non-native',
    'native rate', 'non-native rate',
  ];

  return splitSignals.some((s) => haystack.includes(s));
}
