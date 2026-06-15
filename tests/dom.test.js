import test from 'node:test';
import assert from 'node:assert/strict';
import { renderListItems, renderTags, externalLink } from '../src/helpers/dom.js';

test('renderListItems wraps each item in <li> tags', () => {
  assert.equal(renderListItems(['a', 'b']), '<li>a</li><li>b</li>');
  assert.equal(renderListItems([]), '');
});

test('renderTags wraps each item in <span> tags', () => {
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
