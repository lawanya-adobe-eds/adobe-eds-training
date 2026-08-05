/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd (wknd.site) site-wide cleanup.
 *
 * The classic WKND Adventures & Travel demo is built with AEM Core Components.
 * This removes the non-authorable site chrome so the import contains only the
 * page-level authorable content (the hero carousel, featured teaser, article /
 * adventure card grids, hero teaser, headings, and CTA buttons — all of which
 * live inside the two nested <main> elements).
 *
 * All selectors below were verified against migration-work/cleaned.html:
 *   - <header class="experiencefragment cmp-experiencefragment--header ...">   (line 5)
 *       Global header experience fragment. Removing it also drops its children:
 *         .cmp-languagenavigation--langnavtoggle / .cmp-languagenavigation--header  (language nav + toggle, line 21-23)
 *         .cmp-navigation--header                                                   (main nav, line 111)
 *         .cmp-search--header / #search-f5a05c82f1                                   (search box, line 134-135)
 *   - <footer class="experiencefragment cmp-experiencefragment--footer ...">   (line 471)
 *       Global footer experience fragment (logo + footer navigation).
 *   - #toggleNav   (line 568)  -> mobile nav hamburger toggle (sibling, outside header)
 *   - #mobileNav   (line 574)  -> mobile navigation panel (sibling, outside header)
 *   - iframe       (line 566)  -> Adobe ID syncing tracking iframe (non-authorable)
 *
 * Cleanup runs in afterTransform: none of these elements affect block parsing
 * (block selectors are specific carousel/teaser/container ids and classes that
 * do not appear inside the header, footer, or mobile nav), so they can be
 * stripped after block extraction.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      // Global header XF (covers language nav toggle, main nav, and search box).
      'header.cmp-experiencefragment--header',
      // Global footer XF (logo + footer navigation).
      'footer.cmp-experiencefragment--footer',
      // Mobile navigation chrome (rendered as siblings, outside the header XF).
      '#toggleNav',
      '#mobileNav',
      // Adobe ID syncing tracking iframe.
      'iframe',
    ]);
  }
}
