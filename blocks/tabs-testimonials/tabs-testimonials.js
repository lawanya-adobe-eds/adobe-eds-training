// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * loads and decorates the testimonials tabs block
 *
 * Authored structure (each row):
 *   cell 1 -> avatar picture + name + role  (becomes the tab button)
 *   cell 2 -> large picture + name + role + quote  (becomes the tab panel)
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonials-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children];

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const tabCell = cells[0];
    const panelCell = cells[1] || cells[0];
    const id = toClassName(tabCell.textContent);

    // --- Tab panel (the row itself) ---
    row.className = 'tabs-testimonials-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('aria-hidden', i > 0);
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');

    // restructure panel content: media + info(name/role/quote)
    panelCell.classList.add('tabs-testimonials-panel-body');
    const media = document.createElement('div');
    media.className = 'tabs-testimonials-media';
    const panelPic = panelCell.querySelector('picture');
    if (panelPic) media.append(panelPic);

    const info = document.createElement('div');
    info.className = 'tabs-testimonials-info';
    const paras = [...panelCell.querySelectorAll('p')].filter((p) => p.textContent.trim());
    paras.forEach((p, idx) => {
      if (p.querySelector('strong')) p.className = 'tabs-testimonials-name';
      else if (idx === paras.length - 1) p.className = 'tabs-testimonials-quote';
      else p.className = 'tabs-testimonials-role';
      info.append(p);
    });

    panelCell.textContent = '';
    if (panelPic) panelCell.append(media);
    panelCell.append(info);

    // --- Tab button ---
    const button = document.createElement('button');
    button.className = 'tabs-testimonials-tab';
    button.id = `tab-${id}`;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    const avatar = document.createElement('span');
    avatar.className = 'tabs-testimonials-avatar';
    const tabPic = tabCell.querySelector('picture');
    if (tabPic) avatar.append(tabPic);

    const tabInfo = document.createElement('span');
    tabInfo.className = 'tabs-testimonials-tab-info';
    const tabParas = [...tabCell.querySelectorAll('p')].filter((p) => p.textContent.trim());
    tabParas.forEach((p) => {
      const span = document.createElement('span');
      span.className = p.querySelector('strong')
        ? 'tabs-testimonials-tab-name'
        : 'tabs-testimonials-tab-role';
      span.textContent = p.textContent.trim();
      tabInfo.append(span);
    });

    if (tabPic) button.append(avatar);
    button.append(tabInfo);

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      row.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);

    // the original tab-source cell is now represented by the button
    if (cells[1]) tabCell.remove();
  });

  block.prepend(tablist);
}
