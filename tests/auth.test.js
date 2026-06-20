import test from 'node:test';
import assert from 'node:assert/strict';
import { authRoadmap, getSession } from '../src/services/auth.js';

test('authRoadmap.currentMode is anonymous', () => {
  assert.equal(authRoadmap.currentMode, 'anonymous');
});

test('authRoadmap.futureCapabilities is a non-empty array of strings', () => {
  assert.ok(Array.isArray(authRoadmap.futureCapabilities));
  assert.ok(authRoadmap.futureCapabilities.length > 0);
  authRoadmap.futureCapabilities.forEach((cap) => {
    assert.equal(typeof cap, 'string');
  });
});

test('getSession returns an unauthenticated visitor session', () => {
  const session = getSession();
  assert.equal(session.isAuthenticated, false);
  assert.equal(session.role, 'visitor');
});

test('getSession includes browse and filter in visitor features', () => {
  const session = getSession();
  assert.ok(Array.isArray(session.features));
  assert.ok(session.features.includes('browse'));
  assert.ok(session.features.includes('filter'));
  assert.ok(session.features.includes('open-source-link'));
});

test('getSession returns a fresh object on every call', () => {
  const a = getSession();
  const b = getSession();
  assert.notEqual(a, b);
  assert.deepEqual(a, b);
});
