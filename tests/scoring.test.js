import test from 'node:test';
import assert from 'node:assert/strict';
import { jobs, commissionPlatforms, excludedCompanies } from '../src/data/jobs.js';
import { formatStars, getCriteriaCount, isEligibleForListing, allListings, hasUnflaggedPayGap, isOpenToAllNationalities } from '../src/services/scoring.js';

test('formatStars renders half-star scores consistently', () => {
  assert.equal(formatStars(3.8), '★★★★☆');
  assert.equal(formatStars(3.5), '★★★½☆');
});

test('eligible jobs meet the 95% confidence threshold and a real work mode', () => {
  const eligible = jobs.filter(isEligibleForListing);
  assert.ok(eligible.length > 0, 'At least one job should be eligible');
  const validModes = ['Worldwide Remote', 'Visa Sponsorship', 'India-based, Open to All Nationalities'];
  eligible.forEach((job) => {
    assert.ok(job.confidence >= 0.95, `${job.id} confidence ${job.confidence} should be >= 0.95`);
    assert.ok(validModes.includes(job.workMode), `${job.id} has unsupported workMode ${job.workMode}`);
    assert.ok(isOpenToAllNationalities(job), `${job.id} must be open to all nationalities`);
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
  assert.ok(excludedCompanies.length >= 7, 'Expected at least seven excluded companies for reviewer transparency');
  excludedCompanies.forEach((c) => {
    assert.ok(c.company && c.reason && c.sourceUrl, 'Each excluded company needs a name, reason, and source URL');
    assert.ok(c.reason.length > 20, `${c.company} reason is too thin`);
  });
});

test('no current listing restricts by nationality, citizenship, or long-term residency', () => {
  allListings().forEach((job) => {
    assert.ok(isOpenToAllNationalities(job), `${job.id} (${job.company}) restricts by nationality/residency — fails the all-nationalities rule`);
  });
});

test('every role with a language requirement is open to all nationalities with that ability', () => {
  allListings().forEach((job) => {
    if (!job.languageRequirement) return;
    assert.equal(job.languageRequirement.openToAllNationalitiesWithAbility, true, `${job.id} language gate must be open to all nationalities with the requisite ability`);
  });
});

test('every India-based listing carries verifiable equal-opportunity employer evidence', () => {
  const indiaRoles = jobs.filter((j) => j.workMode === 'India-based, Open to All Nationalities');
  assert.ok(indiaRoles.length > 0, 'Expected at least one India-based role');
  indiaRoles.forEach((job) => {
    const ev = job.nationalityOpenEvidence;
    assert.ok(ev, `${job.id} must carry nationalityOpenEvidence`);
    assert.ok(ev.policy && ev.policy.length > 30, `${job.id} EEO policy quote is too thin`);
    assert.ok(ev.sourceUrl && ev.sourceUrl.startsWith('http'), `${job.id} EEO source URL must be http(s)`);
    assert.ok(ev.explanation && ev.explanation.length > 20, `${job.id} EEO explanation is too thin`);
  });
});
