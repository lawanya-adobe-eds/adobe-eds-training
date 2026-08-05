import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-blog-card-image';
      else div.className = 'cards-blog-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const newImg = optimized.querySelector('img');
    const w = img.getAttribute('width');
    const h = img.getAttribute('height');
    if (w && h) {
      newImg.setAttribute('width', w);
      newImg.setAttribute('height', h);
    } else {
      // blog card images are 16:10 per the block's CSS aspect-ratio
      newImg.setAttribute('width', '750');
      newImg.setAttribute('height', '469');
    }
    img.closest('picture').replaceWith(optimized);
  });

  ul.querySelectorAll('li').forEach((li) => {
    const body = li.querySelector('.cards-blog-card-body');
    if (!body) return;

    // Split the meta paragraph (e.g. "Casual Cool May 12") into a category
    // pill and a secondary date. The date is the trailing "Month Day" pattern.
    const metaP = body.querySelector('p');
    if (metaP) {
      const text = metaP.textContent.trim();
      const dateMatch = text.match(/\s+([A-Z][a-z]+\.?\s+\d{1,2})$/);
      const meta = document.createElement('div');
      meta.className = 'cards-blog-card-meta';
      const category = dateMatch ? text.slice(0, dateMatch.index).trim() : text;
      const date = dateMatch ? dateMatch[1].trim() : '';
      if (category) {
        const tag = document.createElement('span');
        tag.className = 'cards-blog-card-tag';
        tag.textContent = category;
        meta.append(tag);
      }
      if (date) {
        const dateEl = document.createElement('span');
        dateEl.className = 'cards-blog-card-date';
        dateEl.textContent = date;
        meta.append(dateEl);
      }
      metaP.replaceWith(meta);
    }

    // Make the whole card clickable using the title link's href.
    const titleLink = li.querySelector('h3 a');
    if (titleLink) {
      const href = titleLink.getAttribute('href');
      const anchor = document.createElement('a');
      anchor.className = 'cards-blog-card-link';
      anchor.href = href;
      anchor.setAttribute('aria-label', titleLink.textContent.trim());
      // unwrap the inner link, keeping the heading text
      titleLink.replaceWith(...titleLink.childNodes);
      while (li.firstChild) anchor.append(li.firstChild);
      li.append(anchor);
    }
  });

  block.replaceChildren(ul);
}
