import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // tag structural sections so CSS can lay them out (content-first: read from DOM)
  const sections = footer.querySelectorAll(':scope > div');
  if (sections[0]) sections[0].classList.add('footer-brand');
  if (sections[1]) sections[1].classList.add('footer-links');

  // the brand section's two paragraphs are the logo/wordmark and the social row
  const brand = footer.querySelector('.footer-brand');
  if (brand) {
    const paras = brand.querySelectorAll('p');
    if (paras[0]) paras[0].classList.add('footer-brand-logo');
    if (paras[1]) paras[1].classList.add('footer-social');
  }

  block.append(footer);
}
