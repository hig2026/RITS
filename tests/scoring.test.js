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
  assert.equal(formatConfidence(0.95), '95%');
  assert.equal(formatConfidence(0.97), '97%');
  assert.equal(formatConfidence(1), '100%');
});

test('eligible jobs meet the 95% confidence threshold', () => {
  const eligible = jobs.filter(isEligibleForListing);
  assert.ok(eligible.length > 0, 'At least one job should be eligible');
  eligible.forEach((job) => {
    assert.ok(job.confidence >= CONFIDENCE_THRESHOLD, `${job.id} confidence ${job.confidence} should be >= ${CONFIDENCE_THRESHOLD}`);
  });
});

test('jobs below 95% confidence are correctly excluded', () => {
  const ineligible = jobs.filter((j) => !isEligibleForListing(j));
  ineligible.forEach((job) => {
    assert.ok(job.confidence < CONFIDENCE_THRESHOLD || !ELIGIBLE_WORK_MODES.includes(job.workMode),
      `${job.id} should fail the eligibility filter`);
  });
});

test('credibility model keeps five equal-weight score criteria', () => {
  assert.equal(getCriteriaCount(), 5);
});

test('constants are consistent with scoring logic', () => {
  assert.equal(SCORE_CRITERIA.length, MAX_STARS);
  assert.equal(CONFIDENCE_THRESHOLD, 0.95);
  assert.equal(ELIGIBLE_WORK_MODES.length, 2);
});
