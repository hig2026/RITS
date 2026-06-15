import test from 'node:test';
import assert from 'node:assert/strict';
import { jobs } from '../src/data/jobs.js';
import { SCORE_CRITERIA, CONFIDENCE_THRESHOLD, MAX_STARS, ELIGIBLE_WORK_MODES } from '../src/constants.js';
import { formatStars, formatConfidence, getCriteriaCount, isEligibleForListing } from '../src/services/scoring.js';

test('formatStars renders half-star scores consistently', () => {
  assert.equal(formatStars(3.8), '★★★★☆');
  assert.equal(formatStars(3.5), '★★★½☆');
});

test('formatConfidence returns a percentage string', () => {
  assert.equal(formatConfidence(0.92), '92%');
  assert.equal(formatConfidence(0.9), '90%');
  assert.equal(formatConfidence(1), '100%');
});

test('all seeded jobs meet the India-friendly confidence threshold', () => {
  assert.ok(jobs.length > 0);
  assert.equal(jobs.every(isEligibleForListing), true);
});

test('credibility model keeps five equal-weight score criteria', () => {
  assert.equal(getCriteriaCount(), 5);
});

test('constants are consistent with scoring logic', () => {
  assert.equal(SCORE_CRITERIA.length, MAX_STARS);
  assert.equal(CONFIDENCE_THRESHOLD, 0.9);
  assert.equal(ELIGIBLE_WORK_MODES.length, 2);
});
