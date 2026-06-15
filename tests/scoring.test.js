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
