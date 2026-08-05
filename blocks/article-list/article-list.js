import { createOptimizedPicture } from '../../scripts/aem.js';

const PAGE_SIZE = 10;

/**
 * Build a single article card from a query-index entry.
 * @param {Object} item Query-index row ({ path, title, image, description, ... })
 * @returns {HTMLElement} <li> card
 */
function buildCard(item) {
  const li = document.createElement('li');
  li.className = 'article-list-card';

  const link = document.createElement('a');
  link.className = 'article-list-card-link';
  link.href = item.path;
  link.setAttribute('aria-label', item.title || item.path);

  if (item.image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'article-list-card-image';
    imageDiv.append(createOptimizedPicture(item.image, item.title || '', false, [{ width: '750' }]));
    link.append(imageDiv);
  }

  const body = document.createElement('div');
  body.className = 'article-list-card-body';
  if (item.title) {
    const h3 = document.createElement('h3');
    h3.textContent = item.title;
    body.append(h3);
  }
  if (item.description) {
    const p = document.createElement('p');
    p.textContent = item.description;
    body.append(p);
  }
  link.append(body);

  li.append(link);
  return li;
}

/**
 * Article List block.
 * Reads the query index and renders cards, PAGE_SIZE at a time, with a
 * "Load more" button that reveals the next batch.
 *
 * Optional authored config (1-col rows, "key: value"):
 *   source: /custom-index.json   (default: /query-index.json)
 *   filter: /blog/               (only include paths starting with this prefix)
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // read optional config from authored rows
  const config = {};
  [...block.children].forEach((row) => {
    const text = row.textContent.trim();
    const idx = text.indexOf(':');
    if (idx > 0) {
      const key = text.slice(0, idx).trim().toLowerCase();
      config[key] = text.slice(idx + 1).trim();
    }
  });
  const source = config.source || '/query-index.json';
  const prefix = config.filter || '';

  block.textContent = '';

  const list = document.createElement('ul');
  list.className = 'article-list-items';
  block.append(list);

  let items = [];
  try {
    const resp = await fetch(source);
    if (resp.ok) {
      const json = await resp.json();
      items = (json.data || []).filter((it) => it.path && (!prefix || it.path.startsWith(prefix)));
    }
  } catch (e) {
    // network/parse error -> leave items empty, handled below
  }

  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'article-list-empty';
    empty.textContent = 'No articles found.';
    block.append(empty);
    return;
  }

  let shown = 0;
  const renderNext = () => {
    items.slice(shown, shown + PAGE_SIZE).forEach((item) => list.append(buildCard(item)));
    shown += PAGE_SIZE;
  };

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'article-list-more button';
  button.textContent = 'Load more';
  button.addEventListener('click', () => {
    renderNext();
    if (shown >= items.length) button.remove();
  });

  renderNext();
  if (shown < items.length) block.append(button);
}
