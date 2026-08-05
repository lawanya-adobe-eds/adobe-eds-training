/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-wknd.js
  var import_wknd_exports = {};
  __export(import_wknd_exports, {
    default: () => import_wknd_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document: document2 }) {
    const slides = element.querySelectorAll('.cmp-carousel__item, [class*="carousel__item"]');
    const cells = [];
    slides.forEach((slide) => {
      const imageCell = [];
      const img = slide.querySelector(".cmp-teaser__image img, .cmp-image img, img");
      if (img) imageCell.push(img);
      const contentCell = [];
      const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
      if (heading) contentCell.push(heading);
      const description = slide.querySelector('.cmp-teaser__description, [class*="description"]');
      if (description) contentCell.push(description);
      const cta = slide.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a, a");
      if (cta) contentCell.push(cta);
      if (imageCell.length || contentCell.length) {
        cells.push([imageCell, contentCell]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const teaser = element.matches('.cmp-teaser, [class*="teaser"]') ? element : element.querySelector('.cmp-teaser, [class*="cmp-teaser"]');
    const teaserContent = teaser ? teaser.querySelector('.cmp-teaser__content, [class*="teaser__content"]') : null;
    if (teaser && teaserContent) {
      const imageCell = [];
      const teaserImg = teaser.querySelector(".cmp-teaser__image img, .cmp-image img, img");
      if (teaserImg) imageCell.push(teaserImg);
      const bodyCell = [];
      const eyebrow = teaserContent.querySelector('.cmp-teaser__pretitle, [class*="pretitle"]');
      if (eyebrow) bodyCell.push(eyebrow);
      const teaserHeading = teaserContent.querySelector(".cmp-teaser__title, h1, h2, h3, h4");
      if (teaserHeading) bodyCell.push(teaserHeading);
      const teaserDesc = teaserContent.querySelector('.cmp-teaser__description, [class*="description"]');
      if (teaserDesc) bodyCell.push(teaserDesc);
      const teaserCta = teaserContent.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a, a");
      if (teaserCta) bodyCell.push(teaserCta);
      if (imageCell.length || bodyCell.length) {
        const teaserBlock = WebImporter.Blocks.createBlock(document2, {
          name: "columns-article",
          cells: [[imageCell, bodyCell]]
          // one row, two columns
        });
        element.replaceWith(teaserBlock);
        return;
      }
    }
    const columns = element.querySelectorAll(":scope > div");
    const imageCol = columns[0] || null;
    const contentCol = columns[1] || null;
    const leftCell = [];
    if (imageCol) {
      const img = imageCol.querySelector("img");
      if (img) leftCell.push(img);
    }
    const rightCell = [];
    if (contentCol) {
      const breadcrumb = contentCol.querySelector(":scope > .breadcrumbs");
      if (breadcrumb) rightCell.push(breadcrumb);
      const heading = contentCol.querySelector('h1, h2, [class*="heading"]');
      if (heading) rightCell.push(heading);
      const metaBlocks = contentCol.querySelectorAll(":scope > div:not(.breadcrumbs)");
      metaBlocks.forEach((div) => rightCell.push(div));
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document: document2 }) {
    const cards = element.querySelectorAll(".cmp-image-list__item, li");
    const cells = [];
    cards.forEach((card) => {
      const imageCell = [];
      const img = card.querySelector(".cmp-image-list__item-image img, .cmp-image img, img");
      if (img) imageCell.push(img);
      const bodyCell = [];
      const titleLink = card.querySelector('.cmp-image-list__item-title-link, a[class*="title-link"]');
      const titleSpan = card.querySelector('.cmp-image-list__item-title, [class*="item-title"]');
      const titleText = titleSpan || titleLink ? (titleSpan || titleLink).textContent.trim() : "";
      const href = titleLink ? titleLink.getAttribute("href") : null;
      if (titleText) {
        const heading = document2.createElement("h3");
        if (href) {
          const link = document2.createElement("a");
          link.setAttribute("href", href);
          link.textContent = titleText;
          heading.appendChild(link);
        } else {
          heading.textContent = titleText;
        }
        bodyCell.push(heading);
      }
      const description = card.querySelector('.cmp-image-list__item-description, [class*="item-description"]');
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        bodyCell.push(p);
      }
      if (imageCell.length || bodyCell.length) {
        cells.push([imageCell, bodyCell]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse4(element, { document: document2 }) {
    const teaser = element.matches('.cmp-teaser, [class*="cmp-teaser"]') ? element : element.querySelector('.cmp-teaser, [class*="cmp-teaser"]');
    if (teaser && teaser.querySelector('.cmp-teaser__content, [class*="teaser__content"]')) {
      const cells2 = [];
      const teaserImg = teaser.querySelector(".cmp-teaser__image img, .cmp-image img, img");
      if (teaserImg) cells2.push([teaserImg]);
      const contentCell2 = [];
      const teaserHeading = teaser.querySelector(".cmp-teaser__title, h1, h2, h3, h4");
      if (teaserHeading) contentCell2.push(teaserHeading);
      const teaserDesc = teaser.querySelector('.cmp-teaser__description, [class*="description"]');
      if (teaserDesc) contentCell2.push(teaserDesc);
      const teaserCta = teaser.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a, a");
      if (teaserCta) contentCell2.push(teaserCta);
      cells2.push([contentCell2]);
      if (!teaserImg && contentCell2.length === 0) {
        element.replaceWith(...element.childNodes);
        return;
      }
      const teaserBlock = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells: cells2 });
      element.replaceWith(teaserBlock);
      return;
    }
    const bgImage = element.querySelector('img[class*="overlay"], img.cover-image, img');
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const buttonGroup = element.querySelector(".button-group");
    if (!bgImage && !heading && !subheading) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (buttonGroup) {
      contentCell.push(buttonGroup);
    } else {
      const links = element.querySelectorAll('a.button, a[class*="button"], a');
      links.forEach((a) => contentCell.push(a));
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Global header XF (covers language nav toggle, main nav, and search box).
        "header.cmp-experiencefragment--header",
        // Global footer XF (logo + footer navigation).
        "footer.cmp-experiencefragment--footer",
        // Mobile navigation chrome (rendered as siblings, outside the header XF).
        "#toggleNav",
        "#mobileNav",
        // Adobe ID syncing tracking iframe.
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SECTIONS = [
    { selector: ".cmp-carousel--hero", style: null },
    { selector: ".cmp-teaser--featured", style: "grey" },
    { selector: "#title-c2d2b28d00", style: null },
    { selector: "#title-971080d74b", style: null },
    { selector: "#title-ca6ac0fe65", style: null }
  ];
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const resolve = (selector) => {
      let el = null;
      try {
        el = element.querySelector(selector);
      } catch (e) {
        el = null;
      }
      if (!el && typeof document !== "undefined") {
        try {
          el = document.querySelector(selector);
        } catch (e) {
          el = null;
        }
      }
      return el;
    };
    for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
      const { selector, style } = SECTIONS[i];
      const anchorEl = resolve(selector);
      if (!anchorEl) continue;
      if (style) {
        const block = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style }
        });
        anchorEl.after(block);
      }
      if (i > 0) {
        anchorEl.before(document.createElement("hr"));
      }
    }
  }

  // tools/importer/import-wknd.js
  var PAGE_TEMPLATE = {
    name: "wknd",
    description: "WKND Adventures & Travel home page: rotating hero carousel (3 slides), grey featured-article promo (image beside text), Recent Articles heading + 4-card grid + All Articles button, Next Adventures heading + full-bleed hero teaser, and Where do you want to go? heading + 4-card grid + All Trips button.",
    urls: [
      "https://wknd.site/us/en.html"
    ],
    blocks: [
      { name: "carousel-hero", instances: [".cmp-carousel--hero"] },
      { name: "columns-article", instances: [".cmp-teaser--featured"] },
      { name: "cards-feature", instances: ["#container-9c4899b718 .cmp-image-list", "#container-4d3fed64ff .cmp-image-list"] },
      { name: "hero-banner", instances: ["#teaser-ef0ce278d1"] }
    ],
    sections: [
      { id: "s1", name: "hero-carousel", selector: ".cmp-carousel--hero", style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "s2", name: "featured-article", selector: ".cmp-teaser--featured", style: "grey", blocks: ["columns-article"], defaultContent: [] },
      { id: "s3", name: "recent-articles", selector: "#container-9c4899b718", style: null, blocks: ["cards-feature"], defaultContent: ["#title-c2d2b28d00", "#button-2e6d32893a"] },
      { id: "s4", name: "next-adventures", selector: "#teaser-ef0ce278d1", style: null, blocks: ["hero-banner"], defaultContent: ["#title-971080d74b"] },
      { id: "s5", name: "where-to-go", selector: "#container-4d3fed64ff", style: null, blocks: ["cards-feature"], defaultContent: ["#title-ca6ac0fe65", "#button-b6562c963d"] }
    ]
  };
  var TARGET_PATH = "/wknd";
  var parsers = {
    "carousel-hero": parse,
    "columns-article": parse2,
    "cards-feature": parse3,
    "hero-banner": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_wknd_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(TARGET_PATH);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_wknd_exports);
})();
