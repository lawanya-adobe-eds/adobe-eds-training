/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Handles two source structures (single row, two columns each):
 *
 * A) wknd-trendsetters (https://wknd-trendsetters.site/about-us) — a .grid-layout
 *    with two direct-child column divs.
 *      Column 1 = article image
 *      Column 2 = breadcrumb (Home / Case studies) + H2 heading + author + date
 *
 * B) WKND (https://wknd.site/us/en.html) — an AEM Core Components featured teaser
 *    (.cmp-teaser--featured) where content and image live in nested
 *    .cmp-teaser__content / .cmp-teaser__image wrappers (no direct-child columns).
 *      Column 1 = teaser image
 *      Column 2 = eyebrow "Featured Article" + H2 heading + description + "Full Article" CTA
 */
export default function parse(element, { document }) {
  // --- Structure B: AEM Core Components featured teaser ---
  // Detected when the element is (or contains) a .cmp-teaser without direct-child
  // column divs. Extract from the nested content/image wrappers.
  const teaser = element.matches('.cmp-teaser, [class*="teaser"]')
    ? element
    : element.querySelector('.cmp-teaser, [class*="cmp-teaser"]');
  const teaserContent = teaser
    ? teaser.querySelector('.cmp-teaser__content, [class*="teaser__content"]')
    : null;
  if (teaser && teaserContent) {
    // --- Column 1: teaser image ---
    const imageCell = [];
    const teaserImg = teaser.querySelector('.cmp-teaser__image img, .cmp-image img, img');
    if (teaserImg) imageCell.push(teaserImg);

    // --- Column 2: eyebrow + heading + description + CTA ---
    const bodyCell = [];
    const eyebrow = teaserContent.querySelector('.cmp-teaser__pretitle, [class*="pretitle"]');
    if (eyebrow) bodyCell.push(eyebrow);
    // NOTE: do not use a [class*="title"] fallback here — it would also match
    // the .cmp-teaser__pretitle eyebrow (which contains "title"), and since the
    // pretitle appears first in document order querySelector would return it.
    const teaserHeading = teaserContent.querySelector('.cmp-teaser__title, h1, h2, h3, h4');
    if (teaserHeading) bodyCell.push(teaserHeading);
    const teaserDesc = teaserContent.querySelector('.cmp-teaser__description, [class*="description"]');
    if (teaserDesc) bodyCell.push(teaserDesc);
    const teaserCta = teaserContent.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a');
    if (teaserCta) bodyCell.push(teaserCta);

    if (imageCell.length || bodyCell.length) {
      const teaserBlock = WebImporter.Blocks.createBlock(document, {
        name: 'columns-article',
        cells: [[imageCell, bodyCell]], // one row, two columns
      });
      element.replaceWith(teaserBlock);
      return;
    }
  }

  // --- Structure A: grid-layout with two direct-child column divs ---
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
