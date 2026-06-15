const SAFE_LINK_ATTRS = 'target="_blank" rel="noopener noreferrer"';

export function renderListItems(items) {
  return items.map((item) => `<li>${item}</li>`).join('');
}

export function renderTags(items) {
  return items.map((tag) => `<span>${tag}</span>`).join('');
}

export function externalLink(url, text, className) {
  return `<a class="${className}" href="${url}" ${SAFE_LINK_ATTRS}>${text}</a>`;
}
