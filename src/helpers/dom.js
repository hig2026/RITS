const SAFE_LINK_ATTRS = 'target="_blank" rel="noopener noreferrer"';

export function esc(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

export function renderListItems(items) {
  return items.map((item) => `<li>${esc(item)}</li>`).join('');
}

export function renderTags(items) {
  return items.map((tag) => `<span>${esc(tag)}</span>`).join('');
}

export function externalLink(url, text, className) {
  return `<a class="${className}" href="${esc(url)}" ${SAFE_LINK_ATTRS}>${text}</a>`;
}
