/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://wknd.site/us/en.html (AEM Core Components image list .cmp-image-list)
 * Handles both the "Recent Articles" and "Where do you want to go?" grids.
 * Structure: 2 columns, one row per card.
 *   Row 1 = block name (added by createBlock)
 *   Cell 1 = card image (mandatory)
 *   Cell 2 = linked title (Heading) + description
 */
export default function parse(element, { document }) {
  // Each card is an image-list item; fall back to direct list items.
  const cards = element.querySelectorAll('.cmp-image-list__item, li');

  const cells = [];
  cards.forEach((card) => {
    // --- Cell 1: card image ---
    const imageCell = [];
    const img = card.querySelector('.cmp-image-list__item-image img, .cmp-image img, img');
    if (img) imageCell.push(img);

    // --- Cell 2: linked title + description ---
    const bodyCell = [];

    // Title with its link, if present. Rebuild as a heading link so the title
    // renders as a proper heading while remaining clickable.
    const titleLink = card.querySelector('.cmp-image-list__item-title-link, a[class*="title-link"]');
    const titleSpan = card.querySelector('.cmp-image-list__item-title, [class*="item-title"]');
    const titleText = (titleSpan || titleLink) ? (titleSpan || titleLink).textContent.trim() : '';
    const href = titleLink ? titleLink.getAttribute('href') : null;
    if (titleText) {
      const heading = document.createElement('h3');
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = titleText;
        heading.appendChild(link);
      } else {
        heading.textContent = titleText;
      }
      bodyCell.push(heading);
    }

    // Description below the title.
    const description = card.querySelector('.cmp-image-list__item-description, [class*="item-description"]');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      bodyCell.push(p);
    }

    if (imageCell.length || bodyCell.length) {
      cells.push([imageCell, bodyCell]); // two columns per card
    }
  });

  // Empty-block guard: bail gracefully if no cards were found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
