import test from 'node:test';
import assert from 'node:assert/strict';
import { jobs, scoreCriteria } from '../src/data/jobs.js';

const REQUIRED_FIELDS = [
  'id', 'title', 'company', 'category', 'workMode',
  'eligibility', 'confidence', 'score', 'pay',
  'sourceUrl', 'companyUrl', 'verifiedOn',
  'credibilityNotes', 'tags'
];

test('jobs array is non-empty', () => {
  assert.ok(jobs.length > 0, 'seed data must contain at least one job');
});

test('every job has all required fields', () => {
  jobs.forEach((job) => {
    REQUIRED_FIELDS.forEach((field) => {
      assert.ok(field in job, `job "${job.id}" is missing field "${field}"`);
    });
  });
});

test('every job.id is a unique, non-empty string', () => {
  const ids = jobs.map((j) => j.id);
  ids.forEach((id) => assert.equal(typeof id, 'string'));
  ids.forEach((id) => assert.ok(id.length > 0));
  assert.equal(new Set(ids).size, ids.length, 'duplicate job ids found');
});

test('confidence values are between 0 and 1 inclusive', () => {
  jobs.forEach((job) => {
    assert.ok(job.confidence >= 0 && job.confidence <= 1,
      `job "${job.id}" has out-of-range confidence ${job.confidence}`);
  });
});

test('score values are between 0 and 5 inclusive', () => {
  jobs.forEach((job) => {
    assert.ok(job.score >= 0 && job.score <= 5,
      `job "${job.id}" has out-of-range score ${job.score}`);
  });
});

test('sourceUrl and companyUrl are valid URLs', () => {
  jobs.forEach((job) => {
    assert.doesNotThrow(() => new URL(job.sourceUrl),
      `job "${job.id}" has invalid sourceUrl`);
    assert.doesNotThrow(() => new URL(job.companyUrl),
      `job "${job.id}" has invalid companyUrl`);
  });
});

test('verifiedOn is a valid YYYY-MM-DD date string', () => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  jobs.forEach((job) => {
    assert.ok(datePattern.test(job.verifiedOn),
      `job "${job.id}" verifiedOn "${job.verifiedOn}" is not YYYY-MM-DD`);
    assert.ok(!Number.isNaN(Date.parse(job.verifiedOn)),
      `job "${job.id}" verifiedOn is not a parseable date`);
  });
});

test('credibilityNotes is a non-empty array of strings', () => {
  jobs.forEach((job) => {
    assert.ok(Array.isArray(job.credibilityNotes));
    assert.ok(job.credibilityNotes.length > 0,
      `job "${job.id}" has empty credibilityNotes`);
    job.credibilityNotes.forEach((note) => {
      assert.equal(typeof note, 'string');
    });
  });
});

test('tags is a non-empty array of strings', () => {
  jobs.forEach((job) => {
    assert.ok(Array.isArray(job.tags));
    assert.ok(job.tags.length > 0, `job "${job.id}" has no tags`);
    job.tags.forEach((tag) => {
      assert.equal(typeof tag, 'string');
    });
  });
});

test('workMode is one of the known modes', () => {
  const knownModes = ['Worldwide Remote', 'Visa Sponsorship'];
  jobs.forEach((job) => {
    assert.ok(knownModes.includes(job.workMode),
      `job "${job.id}" has unknown workMode "${job.workMode}"`);
  });
});

test('scoreCriteria has exactly five dimensions', () => {
  assert.equal(scoreCriteria.length, 5);
});

test('scoreCriteria entries are unique non-empty strings', () => {
  scoreCriteria.forEach((c) => {
    assert.equal(typeof c, 'string');
    assert.ok(c.length > 0);
  });
  assert.equal(new Set(scoreCriteria).size, scoreCriteria.length);
});
