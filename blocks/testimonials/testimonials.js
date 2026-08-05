/**
 * Testimonials block
 * Repeating grid of testimonial cards. Each authored row = one testimonial
 * containing an avatar image, a quote, and a name/role line.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'testimonials-card';

    // flatten single-cell wrappers so we can read the row's content directly
    const cell = row.children.length === 1 ? row.firstElementChild : row;

    // avatar: the first picture (or bare img) in the card
    const pic = cell.querySelector('picture') || cell.querySelector('img');
    const avatar = document.createElement('div');
    avatar.className = 'testimonials-avatar';
    if (pic) avatar.append(pic);

    // remaining text paragraphs (in order): quote first, then name/role
    const paras = [...cell.querySelectorAll('p')].filter((p) => p.textContent.trim());

    const quoteText = paras[0] ? paras[0].textContent.trim() : '';
    const nameText = paras[1] ? paras[1].textContent.trim() : '';

    const quote = document.createElement('blockquote');
    quote.className = 'testimonials-quote';
    quote.textContent = quoteText;

    const name = document.createElement('p');
    name.className = 'testimonials-name';
    name.textContent = nameText;

    // rebuild the card
    row.textContent = '';
    if (pic) row.append(avatar);
    if (quoteText) row.append(quote);
    if (nameText) row.append(name);
  });
}
