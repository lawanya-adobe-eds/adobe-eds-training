/**
 * Quote block
 * Content model (1 column):
 *   Row 1 = quote text   -> <blockquote class="quote-text">
 *   Row 2 = attribution  -> <cite class="quote-attribution"> (optional)
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Row 1: quote text
  const quoteRow = rows[0];
  const quoteText = quoteRow ? quoteRow.textContent.trim() : '';

  // Row 2 (optional): attribution
  const attrRow = rows[1];
  const attribution = attrRow ? attrRow.textContent.trim() : '';

  const figure = document.createElement('figure');
  figure.className = 'quote-figure';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quote-text';
  blockquote.textContent = quoteText;
  figure.append(blockquote);

  if (attribution) {
    const cite = document.createElement('figcaption');
    cite.className = 'quote-attribution';
    const citeEl = document.createElement('cite');
    citeEl.textContent = attribution;
    cite.append(citeEl);
    figure.append(cite);
  }

  block.textContent = '';
  block.append(figure);
}
