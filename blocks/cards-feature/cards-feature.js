import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-feature-card-image';
      else div.className = 'cards-feature-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Make each card clickable using the title link's href, matching cards-blog.
  ul.querySelectorAll('li').forEach((li) => {
    const body = li.querySelector('.cards-feature-card-body');
    if (!body) return;
    const titleLink = body.querySelector('a[href]');
    if (!titleLink) return;
    const href = titleLink.getAttribute('href');
    const anchor = document.createElement('a');
    anchor.className = 'cards-feature-card-link';
    anchor.href = href;
    anchor.setAttribute('aria-label', titleLink.textContent.trim());
    titleLink.replaceWith(...titleLink.childNodes);
    while (li.firstChild) anchor.append(li.firstChild);
    li.append(anchor);
  });

  block.textContent = '';
  block.append(ul);
}
