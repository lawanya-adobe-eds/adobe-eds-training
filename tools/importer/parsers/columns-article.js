/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: single row, two columns.
 *   Column 1 = article image
 *   Column 2 = breadcrumb (Home / Case studies) + H2 heading + author + date
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll(':scope > div');
  const imageCol = columns[0] || null;
  const contentCol = columns[1] || null;

  // --- Column 1: image ---
  const leftCell = [];
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) leftCell.push(img);
  }

  // --- Column 2: breadcrumb + heading + author/date meta ---
  const rightCell = [];
  if (contentCol) {
    // Breadcrumb row (Home / Case studies) leads the content column.
    const breadcrumb = contentCol.querySelector(':scope > .breadcrumbs');
    if (breadcrumb) rightCell.push(breadcrumb);

    const heading = contentCol.querySelector('h1, h2, [class*="heading"]');
    if (heading) rightCell.push(heading);

    // Author/date info lives in the div(s) that are not the breadcrumb.
    const metaBlocks = contentCol.querySelectorAll(':scope > div:not(.breadcrumbs)');
    metaBlocks.forEach((div) => rightCell.push(div));
  }

  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([leftCell, rightCell]); // one row, two columns

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
