import test from 'node:test';
import assert from 'node:assert/strict';
import { jobs, commissionPlatforms, excludedCompanies } from '../src/data/jobs.js';
import { formatStars, getCriteriaCount, isEligibleForListing, allListings, hasUnflaggedPayGap } from '../src/services/scoring.js';

test('formatStars renders half-star scores consistently', () => {
  assert.equal(formatStars(3.8), '★★★★☆');
  assert.equal(formatStars(3.5), '★★★½☆');
});

test('eligible jobs meet the 95% confidence threshold and a real work mode', () => {
  const eligible = jobs.filter(isEligibleForListing);
  assert.ok(eligible.length > 0, 'At least one job should be eligible');
  eligible.forEach((job) => {
    assert.ok(job.confidence >= 0.95, `${job.id} confidence ${job.confidence} should be >= 0.95`);
    assert.ok(['Worldwide Remote', 'Visa Sponsorship'].includes(job.workMode), `${job.id} has unsupported workMode ${job.workMode}`);
  });
});

test('commission platforms all meet the worldwide-remote bar and confidence threshold', () => {
  assert.ok(commissionPlatforms.length >= 4, 'Expected at least four commission platforms');
  commissionPlatforms.forEach((p) => {
    assert.equal(p.workMode, 'Worldwide Remote', `${p.id} must be Worldwide Remote`);
    assert.ok(p.confidence >= 0.95, `${p.id} confidence ${p.confidence} should be >= 0.95`);
  });
});

test('no listing uses an aggregator search-result page as its sourceUrl', () => {
  const aggregatorPatterns = ['ziprecruiter.com/Jobs/', 'weworkremotely.com/', 'tefl.com/job-seeker/', 'eslcafe.com/jobs/'];
  allListings().forEach((job) => {
    aggregatorPatterns.forEach((pattern) => {
      assert.ok(!job.sourceUrl.includes(pattern), `${job.id} sourceUrl points to an aggregator search page (${pattern})`);
    });
  });
});

test('any listing with a >10% native/non-native pay gap must flag it explicitly', () => {
  // No listing is allowed to silently carry a pay-disparity warning field that is null
  // while the credibilityNotes or pay text describes a native/non-native split.
  allListings().forEach((job) => {
    const flagged = Boolean(job.payDisparityWarning) || Boolean(job.payGapFlag);
    assert.equal(hasUnflaggedPayGap(job), false, `${job.id} should not report an unflagged gap`);
    // Sanity: the helper must not return true for any current listing.
    assert.ok(typeof flagged === 'boolean');
  });
});

test('excluded companies record why they were dropped, with a source URL', () => {
  assert.ok(excludedCompanies.length >= 5, 'Expected at least five excluded companies for reviewer transparency');
  excludedCompanies.forEach((c) => {
    assert.ok(c.company && c.reason && c.sourceUrl, 'Each excluded company needs a name, reason, and source URL');
    assert.ok(c.reason.length > 20, `${c.company} reason is too thin`);
  });
});

test('credibility model keeps five equal-weight score criteria', () => {
  assert.equal(getCriteriaCount(), 5);
});
