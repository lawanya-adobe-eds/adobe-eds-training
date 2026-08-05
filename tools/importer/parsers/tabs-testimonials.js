/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonials. Base: tabs.
 * Source: https://wknd-trendsetters.site/about-us
 * Structure: 2 columns, one row per testimonial (4 rows).
 *   Cell 1 = tab label   -> avatar + name + role (from the tab-menu button)
 *   Cell 2 = tab content -> photo + name/role + quote (from the matching tab-pane)
 */
export default function parse(element, { document }) {
  // Tab labels live in the tab-menu buttons; panel content in the tab-panes.
  const menuButtons = Array.from(
    element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu [role="tab"]'),
  );
  const panes = Array.from(
    element.querySelectorAll('.tabs-content .tab-pane, .tabs-content [role="tabpanel"]'),
  );

  const cells = [];

  menuButtons.forEach((button, i) => {
    // Label cell: use the inner content of the button (avatar + name/role).
    const labelContent = button.querySelector(':scope > div') || button;

    // Match the pane by data-tab-target -> data-tab-index, else fall back to order.
    const target = button.getAttribute('data-tab-target');
    let pane = null;
    if (target !== null) {
      pane = panes.find((p) => p.getAttribute('data-tab-index') === target) || null;
    }
    if (!pane) pane = panes[i] || null;

    // Content cell: inner content of the pane (photo + name/role + quote).
    const paneContent = pane
      ? (pane.querySelector(':scope > div') || pane)
      : '';

    cells.push([labelContent, paneContent]); // two columns per row
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonials', cells });
  element.replaceWith(block);
}
