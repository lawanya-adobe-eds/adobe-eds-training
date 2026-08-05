/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: 1 column, 3 rows.
 *   Row 1 = block name (added by createBlock)
 *   Row 2 = background image
 *   Row 3 = H2 heading + subheading paragraph + 'See more' CTA link
 */
export default function parse(element, { document }) {
  // Background image (rendered as an overlay cover image in the source).
  const bgImage = element.querySelector('img[class*="overlay"], img.cover-image, img');

  // Text content.
  const heading = element.querySelector('h1, h2, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const buttonGroup = element.querySelector('.button-group');

  // Empty-block guard.
  if (!bgImage && !heading && !subheading) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (single cell).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: heading + subheading + CTA — all in ONE cell (single-column block).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (buttonGroup) {
    contentCell.push(buttonGroup);
  } else {
    const links = element.querySelectorAll('a.button, a[class*="button"], a');
    links.forEach((a) => contentCell.push(a));
  }
  cells.push([contentCell]); // one row, one cell holding all content elements

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
