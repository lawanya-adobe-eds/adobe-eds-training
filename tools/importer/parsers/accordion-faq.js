/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: 2 columns, one row per FAQ item (4 rows).
 *   Cell 1 = question (title, from the summary text — icon excluded)
 *   Cell 2 = answer (content body)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll(':scope > details.faq-item, :scope > details, .faq-item');

  const cells = [];
  items.forEach((item) => {
    // --- Cell 1: question title (span text inside summary, not the svg icon) ---
    const summary = item.querySelector('summary, .faq-question');
    let questionCell = '';
    if (summary) {
      const label = summary.querySelector('span');
      questionCell = label || summary.textContent.trim();
    }

    // --- Cell 2: answer content ---
    const answer = item.querySelector('.faq-answer');
    const answerCell = answer || '';

    cells.push([questionCell, answerCell]); // two columns per row
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
