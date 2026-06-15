import { CONFIDENCE_THRESHOLD, ELIGIBLE_WORK_MODES, MAX_STARS, SCORE_CRITERIA } from '../constants.js';

export function formatStars(score) {
  const rounded = Math.round(score * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalfStar = rounded % 1 !== 0;
  return `${'★'.repeat(fullStars)}${hasHalfStar ? '½' : ''}${'☆'.repeat(MAX_STARS - fullStars - (hasHalfStar ? 1 : 0))}`;
}

export function formatConfidence(confidence) {
  return `${Math.round(confidence * 100)}%`;
}

export function isEligibleForListing(job) {
  return job.confidence >= CONFIDENCE_THRESHOLD && ELIGIBLE_WORK_MODES.includes(job.workMode);
}

export function getCriteriaCount() {
  return SCORE_CRITERIA.length;
}
