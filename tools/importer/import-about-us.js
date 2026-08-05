/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsHeroParser from './parsers/columns-hero.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialsParser from './parsers/tabs-testimonials.js';
import cardsBlogParser from './parsers/cards-blog.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'about-us',
  description: 'About page for WKND Trendsetters with hero (3 images), featured article intro, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and a full-width CTA banner.',
  urls: [
    'https://wknd-trendsetters.site/about-us',
  ],
  blocks: [
    { name: 'columns-hero', instances: ['#main-content > header.section.secondary-section .grid-layout'] },
    { name: 'columns-article', instances: ['#main-content > section.section:nth-of-type(1) .grid-layout'] },
    { name: 'cards-gallery', instances: ['.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm'] },
    { name: 'tabs-testimonials', instances: ['#main-content > section.section:nth-of-type(3) .tabs-wrapper'] },
    { name: 'cards-blog', instances: ['.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md'] },
    { name: 'accordion-faq', instances: ['#main-content > section.section:nth-of-type(5) .faq-list'] },
    { name: 'hero-banner', instances: ['#main-content > section.section.inverse-section .grid-layout'] },
  ],
  sections: [
    { id: 'rc2', name: 'hero-intro', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['columns-hero'], defaultContent: [] },
    { id: 'rc3', name: 'featured-article-intro', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['columns-article'], defaultContent: [] },
    { id: 'rc4', name: 'image-gallery', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary', blocks: ['cards-gallery'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(2) h2', '#main-content > section.section.secondary-section:nth-of-type(2) .paragraph-lg'] },
    { id: 'rc5', name: 'testimonials-tabs', selector: '#main-content > section.section:nth-of-type(3)', style: null, blocks: ['tabs-testimonials'], defaultContent: [] },
    { id: 'rc6', name: 'latest-articles', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'secondary', blocks: ['cards-blog'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(4) h2', '#main-content > section.section.secondary-section:nth-of-type(4) .paragraph-lg'] },
    { id: 'rc7', name: 'faq-accordion', selector: '#main-content > section.section:nth-of-type(5)', style: null, blocks: ['accordion-faq'], defaultContent: ['#main-content > section.section:nth-of-type(5) h2', '#main-content > section.section:nth-of-type(5) .paragraph-lg'] },
    { id: 'rc8', name: 'cta-banner', selector: '#main-content > section.section.inverse-section', style: null, blocks: ['hero-banner'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'columns-hero': columnsHeroParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonials': tabsTestimonialsParser,
  'cards-blog': cardsBlogParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (sections has 7 > 1)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup - removes breadcrumbs before parsing)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
