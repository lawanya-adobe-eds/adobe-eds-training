/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS (wknd-specific; do NOT use the wknd-trendsetters ones)
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json ("wknd")
const PAGE_TEMPLATE = {
  name: 'wknd',
  description: 'WKND Adventures & Travel home page: rotating hero carousel (3 slides), grey featured-article promo (image beside text), Recent Articles heading + 4-card grid + All Articles button, Next Adventures heading + full-bleed hero teaser, and Where do you want to go? heading + 4-card grid + All Trips button.',
  urls: [
    'https://wknd.site/us/en.html',
  ],
  blocks: [
    { name: 'carousel-hero', instances: ['.cmp-carousel--hero'] },
    { name: 'columns-article', instances: ['.cmp-teaser--featured'] },
    { name: 'cards-feature', instances: ['#container-9c4899b718 .cmp-image-list', '#container-4d3fed64ff .cmp-image-list'] },
    { name: 'hero-banner', instances: ['#teaser-ef0ce278d1'] },
  ],
  sections: [
    { id: 's1', name: 'hero-carousel', selector: '.cmp-carousel--hero', style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 's2', name: 'featured-article', selector: '.cmp-teaser--featured', style: 'grey', blocks: ['columns-article'], defaultContent: [] },
    { id: 's3', name: 'recent-articles', selector: '#container-9c4899b718', style: null, blocks: ['cards-feature'], defaultContent: ['#title-c2d2b28d00', '#button-2e6d32893a'] },
    { id: 's4', name: 'next-adventures', selector: '#teaser-ef0ce278d1', style: null, blocks: ['hero-banner'], defaultContent: ['#title-971080d74b'] },
    { id: 's5', name: 'where-to-go', selector: '#container-4d3fed64ff', style: null, blocks: ['cards-feature'], defaultContent: ['#title-ca6ac0fe65', '#button-b6562c963d'] },
  ],
};

// Target path override: the source lives at /us/en but should import to /wknd.
const TARGET_PATH = '/wknd';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-article': columnsArticleParser,
  'cards-feature': cardsFeatureParser,
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (sections needs 2+ sections)
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

    // 1. beforeTransform (initial cleanup)
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

    // 6. Use the fixed target path (source /us/en -> /wknd)
    const path = WebImporter.FileUtils.sanitizePath(TARGET_PATH);

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
