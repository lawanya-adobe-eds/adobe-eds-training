/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks + section metadata.
 *
 * Driven by payload.template.sections (from page-templates.json). For each
 * section (processed in reverse document order so earlier selectors stay valid):
 *   - inserts a Section Metadata block (style cell) when section.style is set
 *   - inserts an <hr> section break before every section except the first
 *
 * Section selectors are stored absolute from #main-content in the template, but
 * this transformer receives `element` = the <main id="main-content"> node, so the
 * leading "#main-content" is rewritten to ":scope" to query relative to element.
 * All selectors were verified against migration-work/cleaned.html:
 *   rc2 #main-content > header.section.secondary-section                  (secondary)
 *   rc3 #main-content > section.section:nth-of-type(1)
 *   rc4 #main-content > section.section.secondary-section:nth-of-type(2)  (secondary)
 *   rc5 #main-content > section.section:nth-of-type(3)
 *   rc6 #main-content > section.section.secondary-section:nth-of-type(4)  (secondary)
 *   rc7 #main-content > section.section:nth-of-type(5)
 *   rc8 #main-content > section.section.inverse-section
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = (payload && payload.template && payload.template.sections) || [];

    // Resolve a section's element within `element` (the #main-content main node).
    const resolveSection = (selector) => {
      if (!selector) return null;
      // Rewrite absolute #main-content selectors to be relative to element.
      const relative = selector
        .replace(/^#main-content\s*>\s*/, ':scope > ')
        .replace(/^#main-content\s+/, ':scope ');
      let el = null;
      try {
        el = element.querySelector(relative);
      } catch (e) {
        el = null;
      }
      // Fallback: query the original absolute selector against the document.
      if (!el && typeof document !== 'undefined') {
        try {
          el = document.querySelector(selector);
        } catch (e) {
          el = null;
        }
      }
      return el;
    };

    // Reverse order keeps nth-of-type selectors of earlier sections valid while inserting.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = resolveSection(section.selector);
      if (!sectionEl) continue;

      // Section Metadata block at the end of the section, when a style is defined.
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(block);
      }

      // Section break before every section except the first.
      if (i > 0) {
        sectionEl.before(document.createElement('hr'));
      }
    }
  }
}
