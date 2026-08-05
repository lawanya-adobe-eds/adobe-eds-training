/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd (wknd.site) section breaks + section metadata.
 *
 * Runs in beforeTransform so it anchors on the ORIGINAL Core Components source
 * elements, which all still exist at that point. (In afterTransform the block
 * parsers have already replaced .cmp-carousel--hero / .cmp-teaser--featured /
 * #teaser-ef0ce278d1 with block tables, so those selectors no longer resolve and
 * a break/metadata insert silently no-ops — which is why section 2 previously
 * merged into section 1 and lost its grey background.)
 *
 * The WKND DOM nests logical sections inside shared containers
 * (#container-9c4899b718 wraps the featured teaser, Recent Articles, AND Next
 * Adventures). Inserting a nested <hr> before a deeply-nested anchor still yields
 * a correct top-level section break in the md conversion (verified: the
 * Recent Articles / Next Adventures / Where-to-go heading anchors, at depth 11,
 * produced clean splits).
 *
 * Five logical sections in document order (anchors verified in cleaned.html and
 * on the live page):
 *   1. hero carousel            .cmp-carousel--hero        (first; no break)
 *   2. featured article (grey)  .cmp-teaser--featured      (break before; grey)
 *   3. Recent Articles          #title-c2d2b28d00          (break before)
 *   4. Next Adventures + hero   #title-971080d74b          (break before)
 *   5. Where do you want to go  #title-ca6ac0fe65          (break before)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Ordered logical sections with source-DOM anchors and optional style.
const SECTIONS = [
  { selector: '.cmp-carousel--hero', style: null },
  { selector: '.cmp-teaser--featured', style: 'grey' },
  { selector: '#title-c2d2b28d00', style: null },
  { selector: '#title-971080d74b', style: null },
  { selector: '#title-ca6ac0fe65', style: null },
];

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;

  const resolve = (selector) => {
    let el = null;
    try {
      el = element.querySelector(selector);
    } catch (e) {
      el = null;
    }
    if (!el && typeof document !== 'undefined') {
      try {
        el = document.querySelector(selector);
      } catch (e) {
        el = null;
      }
    }
    return el;
  };

  // Reverse order keeps earlier anchors in place while inserting nodes.
  for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
    const { selector, style } = SECTIONS[i];
    const anchorEl = resolve(selector);
    if (!anchorEl) continue;

    // Styled section: place a Section Metadata block immediately AFTER this
    // section's content anchor. In document order that is before the next
    // section's <hr>, so it stays inside this section when the doc is split.
    // (Placing it before the next anchor would land it after that section's
    // already-inserted <hr>, pushing it into the next section.)
    if (style) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style },
      });
      anchorEl.after(block);
    }

    // Section break before every section except the first.
    if (i > 0) {
      anchorEl.before(document.createElement('hr'));
    }
  }
}
