/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-blog. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: 2 columns, one row per article (4 rows).
 *   Cell 1 = article image
 *   Cell 2 = body: tag + date (meta) + linked H3 title
 * Each source card is an <a> wrapper; the title becomes a link to that href.
 */
export default function parse(element, { document }) {
  // Each article card is an anchor wrapping image + body.
  const cards = element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a');

  const cells = [];
  cards.forEach((card) => {
    const href = card.getAttribute('href');

    // --- Cell 1: image ---
    const imageCell = [];
    const img = card.querySelector('.article-card-image img, img');
    if (img) imageCell.push(img);

    // --- Cell 2: meta (tag + date) + linked title ---
    const bodyCell = [];
    const meta = card.querySelector('.article-card-meta');
    if (meta) bodyCell.push(meta);

    const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
    if (heading) {
      if (href) {
        // Wrap the heading text in a link to keep the article clickable.
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent.trim();
        heading.textContent = '';
        heading.appendChild(link);
      }
      bodyCell.push(heading);
    }

    cells.push([imageCell, bodyCell]); // two columns per row
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-blog', cells });
  element.replaceWith(block);
}
