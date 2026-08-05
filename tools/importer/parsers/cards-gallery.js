/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: one row per card, each card is a single image-only cell.
 * The gallery has 8 image cards.
 */
export default function parse(element, { document }) {
  // Each direct child div is one gallery item wrapping an image.
  const items = element.querySelectorAll(':scope > div');

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img');
    if (img) {
      cells.push([img]); // one column: single image cell per card
    }
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
