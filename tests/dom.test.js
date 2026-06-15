import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// Provide a minimal DOM for the esc() helper which uses document.createElement
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
globalThis.document = dom.window.document;

const { esc, renderListItems, renderTags, externalLink } = await import('../src/helpers/dom.js');

test('esc escapes HTML entities', () => {
  assert.equal(esc('<script>alert("xss")</script>'), '&lt;script&gt;alert("xss")&lt;/script&gt;');
  assert.equal(esc('safe text'), 'safe text');
});

test('renderListItems wraps each item in escaped <li> tags', () => {
  assert.equal(renderListItems(['a', 'b']), '<li>a</li><li>b</li>');
  assert.equal(renderListItems([]), '');
  assert.ok(renderListItems(['<b>bold</b>']).includes('&lt;b&gt;'));
});

test('renderTags wraps each item in escaped <span> tags', () => {
  assert.equal(renderTags(['Python', 'SQL']), '<span>Python</span><span>SQL</span>');
  assert.equal(renderTags([]), '');
});

test('externalLink produces a safe anchor with target and rel', () => {
  const html = externalLink('https://example.com', 'Example', 'button primary');
  assert.ok(html.includes('href="https://example.com"'));
  assert.ok(html.includes('target="_blank"'));
  assert.ok(html.includes('rel="noopener noreferrer"'));
  assert.ok(html.includes('class="button primary"'));
  assert.ok(html.includes('>Example<'));
});
