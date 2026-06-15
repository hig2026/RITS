import test from 'node:test';
import assert from 'node:assert/strict';
import { formatStars, isEligibleForListing, getCriteriaCount } from '../src/services/scoring.js';

// --- formatStars edge cases ---

test('formatStars: 0 score produces five empty stars', () => {
  assert.equal(formatStars(0), '☆☆☆☆☆');
});

test('formatStars: 5 score produces five full stars', () => {
  assert.equal(formatStars(5), '★★★★★');
});

test('formatStars: 2.5 produces two full stars plus half', () => {
  assert.equal(formatStars(2.5), '★★½☆☆');
});

test('formatStars: 1 score produces one full and four empty', () => {
  assert.equal(formatStars(1), '★☆☆☆☆');
});

test('formatStars: 4.5 produces four full plus half', () => {
  assert.equal(formatStars(4.5), '★★★★½');
});

test('formatStars: value that rounds to nearest half (4.3 → 4.5)', () => {
  assert.equal(formatStars(4.3), '★★★★½');
});

test('formatStars: value that rounds down (4.2 → 4.0)', () => {
  assert.equal(formatStars(4.2), '★★★★☆');
});

test('formatStars: value that rounds up to full star (2.8 → 3.0)', () => {
  assert.equal(formatStars(2.8), '★★★☆☆');
});

// --- isEligibleForListing ---

test('isEligibleForListing: eligible with confidence 0.9 and Worldwide Remote', () => {
  assert.equal(isEligibleForListing({ confidence: 0.9, workMode: 'Worldwide Remote' }), true);
});

test('isEligibleForListing: eligible with confidence 1.0 and Visa Sponsorship', () => {
  assert.equal(isEligibleForListing({ confidence: 1.0, workMode: 'Visa Sponsorship' }), true);
});

test('isEligibleForListing: ineligible when confidence is below 0.9', () => {
  assert.equal(isEligibleForListing({ confidence: 0.89, workMode: 'Worldwide Remote' }), false);
});

test('isEligibleForListing: ineligible with unknown workMode', () => {
  assert.equal(isEligibleForListing({ confidence: 0.95, workMode: 'Office Only' }), false);
});

test('isEligibleForListing: ineligible when workMode is plain Remote', () => {
  assert.equal(isEligibleForListing({ confidence: 0.95, workMode: 'Remote' }), false);
});

test('isEligibleForListing: ineligible when both conditions fail', () => {
  assert.equal(isEligibleForListing({ confidence: 0.5, workMode: 'On-site' }), false);
});

test('isEligibleForListing: boundary — confidence exactly 0.9 is eligible', () => {
  assert.equal(isEligibleForListing({ confidence: 0.9, workMode: 'Visa Sponsorship' }), true);
});

// --- getCriteriaCount ---

test('getCriteriaCount returns a positive integer', () => {
  const count = getCriteriaCount();
  assert.ok(Number.isInteger(count));
  assert.ok(count > 0);
});
