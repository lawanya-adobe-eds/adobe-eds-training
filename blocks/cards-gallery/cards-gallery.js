import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-gallery-card-image';
      else div.className = 'cards-gallery-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // preserve intrinsic dimensions to prevent layout shift (CLS)
    const newImg = optimized.querySelector('img');
    const w = img.getAttribute('width');
    const h = img.getAttribute('height');
    if (w && h) {
      newImg.setAttribute('width', w);
      newImg.setAttribute('height', h);
    } else {
      // gallery cards are square (1:1) per the block's CSS
      newImg.setAttribute('width', '750');
      newImg.setAttribute('height', '750');
    }
    img.closest('picture').replaceWith(optimized);
  });
  block.replaceChildren(ul);
}
