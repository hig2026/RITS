import test from 'node:test';
import assert from 'node:assert/strict';
import { jobs } from '../src/data/jobs.js';
import { formatStars, getCriteriaCount, isEligibleForListing } from '../src/services/scoring.js';

test('formatStars renders half-star scores consistently', () => {
  assert.equal(formatStars(3.8), '★★★★☆');
  assert.equal(formatStars(3.5), '★★★½☆');
});

test('eligible jobs meet the 95% confidence threshold', () => {
  const eligible = jobs.filter(isEligibleForListing);
  assert.ok(eligible.length > 0, 'At least one job should be eligible');
  eligible.forEach((job) => {
    assert.ok(job.confidence >= 0.95, `${job.id} confidence ${job.confidence} should be >= 0.95`);
  });
});

test('jobs below 95% confidence are correctly excluded', () => {
  const ineligible = jobs.filter((j) => !isEligibleForListing(j));
  ineligible.forEach((job) => {
    assert.ok(job.confidence < 0.95 || !['Worldwide Remote', 'Visa Sponsorship'].includes(job.workMode),
      `${job.id} should fail the eligibility filter`);
  });
});

test('credibility model keeps five equal-weight score criteria', () => {
  assert.equal(getCriteriaCount(), 5);
});

test('formatStars throws on non-number input', () => {
  assert.throws(() => formatStars(undefined), TypeError);
  assert.throws(() => formatStars(null), TypeError);
  assert.throws(() => formatStars('3'), TypeError);
  assert.throws(() => formatStars(NaN), TypeError);
});

test('formatStars clamps out-of-range scores', () => {
  assert.equal(formatStars(-1), '☆☆☆☆☆');
  assert.equal(formatStars(0), '☆☆☆☆☆');
  assert.equal(formatStars(5), '★★★★★');
  assert.equal(formatStars(7), '★★★★★');
});

test('isEligibleForListing throws on null or non-object input', () => {
  assert.throws(() => isEligibleForListing(null), TypeError);
  assert.throws(() => isEligibleForListing(undefined), TypeError);
  assert.throws(() => isEligibleForListing('string'), TypeError);
});

test('isEligibleForListing returns false for jobs with missing fields', () => {
  assert.equal(isEligibleForListing({}), false);
  assert.equal(isEligibleForListing({ confidence: 0.95 }), false);
  assert.equal(isEligibleForListing({ workMode: 'Worldwide Remote' }), false);
});

test('isEligibleForListing returns false for low confidence', () => {
  assert.equal(
    isEligibleForListing({ confidence: 0.5, workMode: 'Worldwide Remote' }),
    false,
  );
});

test('isEligibleForListing returns false for ineligible work mode', () => {
  assert.equal(
    isEligibleForListing({ confidence: 0.95, workMode: 'Onsite' }),
    false,
  );
});
