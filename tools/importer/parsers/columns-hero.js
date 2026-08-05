/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-hero. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: single row, two columns.
 *   Column 1 = heading + subheading + button group (CTAs)
 *   Column 2 = the set of hero images
 */
export default function parse(element, { document }) {
  // The grid has two direct children: text column and image column.
  const columns = element.querySelectorAll(':scope > div');
  const textCol = columns[0] || null;
  const imageCol = columns[1] || null;

  // --- Column 1: heading, subheading, and CTA buttons ---
  const leftCell = [];
  if (textCol) {
    const heading = textCol.querySelector('h1, h2, [class*="heading"]');
    const subheading = textCol.querySelector('p, .subheading, [class*="subheading"]');
    const buttonGroup = textCol.querySelector('.button-group');

    if (heading) leftCell.push(heading);
    if (subheading) leftCell.push(subheading);
    if (buttonGroup) {
      leftCell.push(buttonGroup);
    } else {
      // Fallback: collect standalone CTA links if no button-group wrapper.
      const links = textCol.querySelectorAll('a.button, a[class*="button"], a');
      links.forEach((a) => leftCell.push(a));
    }
  }

  // --- Column 2: hero images ---
  const rightCell = [];
  if (imageCol) {
    const images = imageCol.querySelectorAll('img');
    images.forEach((img) => rightCell.push(img));
  }

  // Empty-block guard: bail gracefully if nothing extracted.
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([leftCell, rightCell]); // one row, two columns

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero', cells });
  element.replaceWith(block);
}
