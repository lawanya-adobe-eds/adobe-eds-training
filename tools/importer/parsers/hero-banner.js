/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero. 1 column, 3 rows.
 *   Row 1 = block name (added by createBlock)
 *   Row 2 = background image
 *   Row 3 = heading + subheading/description + CTA link(s)
 *
 * Handles two source structures:
 *
 * A) wknd-trendsetters (https://wknd-trendsetters.site/about-us) — grid-layout
 *    with an overlay/cover image, H2 heading, <p> subheading and a .button-group.
 *
 * B) WKND (https://wknd.site/us/en.html) — an AEM Core Components teaser
 *    (#teaser-ef0ce278d1 .cmp-teaser) where the description is a
 *    <div class="cmp-teaser__description"> (NOT a <p>) and the CTA is an
 *    .cmp-teaser__action-link. The plain <p> subheading selector used for
 *    structure A misses this description, so detect the teaser explicitly.
 */
export default function parse(element, { document }) {
  const teaser = element.matches('.cmp-teaser, [class*="cmp-teaser"]')
    ? element
    : element.querySelector('.cmp-teaser, [class*="cmp-teaser"]');

  // --- Structure B: AEM Core Components teaser ---
  if (teaser && teaser.querySelector('.cmp-teaser__content, [class*="teaser__content"]')) {
    const cells = [];

    const teaserImg = teaser.querySelector('.cmp-teaser__image img, .cmp-image img, img');
    if (teaserImg) cells.push([teaserImg]); // Row 2: background image

    const contentCell = [];
    const teaserHeading = teaser.querySelector('.cmp-teaser__title, h1, h2, h3, h4');
    if (teaserHeading) contentCell.push(teaserHeading);
    const teaserDesc = teaser.querySelector('.cmp-teaser__description, [class*="description"]');
    if (teaserDesc) contentCell.push(teaserDesc);
    const teaserCta = teaser.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a');
    if (teaserCta) contentCell.push(teaserCta);
    cells.push([contentCell]); // Row 3: single cell holding all content

    if (!teaserImg && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }

    const teaserBlock = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
    element.replaceWith(teaserBlock);
    return;
  }

  // --- Structure A: wknd-trendsetters grid-layout ---
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
