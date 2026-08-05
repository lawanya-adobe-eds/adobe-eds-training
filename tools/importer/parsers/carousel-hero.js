/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/us/en.html (AEM Core Components carousel .cmp-carousel--hero)
 * Structure: 2 columns, multiple rows.
 *   Row 1 = block name (added by createBlock)
 *   One row per slide:
 *     Cell 1 = slide background image (mandatory)
 *     Cell 2 = heading + description + single CTA link (optional text content)
 */
export default function parse(element, { document }) {
  // Each carousel slide is a .cmp-carousel__item wrapping a hero teaser.
  const slides = element.querySelectorAll('.cmp-carousel__item, [class*="carousel__item"]');

  const cells = [];
  slides.forEach((slide) => {
    // --- Cell 1: slide image ---
    const imageCell = [];
    const img = slide.querySelector('.cmp-teaser__image img, .cmp-image img, img');
    if (img) imageCell.push(img);

    // --- Cell 2: heading + description + CTA ---
    const contentCell = [];
    const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    if (heading) contentCell.push(heading);

    const description = slide.querySelector('.cmp-teaser__description, [class*="description"]');
    if (description) contentCell.push(description);

    const cta = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a');
    if (cta) contentCell.push(cta);

    // Only add the slide if it has any content.
    if (imageCell.length || contentCell.length) {
      cells.push([imageCell, contentCell]); // two columns per slide
    }
  });

  // Empty-block guard: bail gracefully if no slides were found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
