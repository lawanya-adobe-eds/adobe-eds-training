/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome and navigation so the import contains only
 * page-level authorable content (the content under <main id="main-content">).
 *
 * All selectors below were verified against migration-work/cleaned.html:
 *   - <a class="skip-link" href="#main-content">      -> skip link (accessibility chrome)
 *   - <div class="navbar">                            -> global header / mega-menu / nav
 *   - <footer class="footer inverse-footer">          -> global footer / footer nav
 *   - <div class="breadcrumbs"> (inside article intro) -> breadcrumb navigation
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove breadcrumb navigation before block parsing so the columns-article
    // parser (section featured-article-intro) does not pick up breadcrumb links.
    // Found in cleaned.html: <div class="breadcrumbs"> within #main-content section 1.
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome. These live outside/around #main-content
    // (navbar and footer contain grid-layout / card-link structures that would
    // otherwise confuse block parsing). Selectors verified in cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }
}
