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

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
  });

  // tools/importer/parsers/columns-hero.js
  function parse(element, { document: document2 }) {
    const columns = element.querySelectorAll(":scope > div");
    const textCol = columns[0] || null;
    const imageCol = columns[1] || null;
    const leftCell = [];
    if (textCol) {
      const heading = textCol.querySelector('h1, h2, [class*="heading"]');
      const subheading = textCol.querySelector('p, .subheading, [class*="subheading"]');
      const buttonGroup = textCol.querySelector(".button-group");
      if (heading) leftCell.push(heading);
      if (subheading) leftCell.push(subheading);
      if (buttonGroup) {
        leftCell.push(buttonGroup);
      } else {
        const links = textCol.querySelectorAll('a.button, a[class*="button"], a');
        links.forEach((a) => leftCell.push(a));
      }
    }
    const rightCell = [];
    if (imageCol) {
      const images = imageCol.querySelectorAll("img");
      images.forEach((img) => rightCell.push(img));
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const items = element.querySelectorAll(":scope > div");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      if (img) {
        cells.push([img]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonials.js
  function parse4(element, { document: document2 }) {
    const menuButtons = Array.from(
      element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu [role="tab"]')
    );
    const panes = Array.from(
      element.querySelectorAll('.tabs-content .tab-pane, .tabs-content [role="tabpanel"]')
    );
    const cells = [];
    menuButtons.forEach((button, i) => {
      const labelContent = button.querySelector(":scope > div") || button;
      const target = button.getAttribute("data-tab-target");
      let pane = null;
      if (target !== null) {
        pane = panes.find((p) => p.getAttribute("data-tab-index") === target) || null;
      }
      if (!pane) pane = panes[i] || null;
      const paneContent = pane ? pane.querySelector(":scope > div") || pane : "";
      cells.push([labelContent, paneContent]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonials", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-blog.js
  function parse5(element, { document: document2 }) {
    const cards = element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > a");
    const cells = [];
    cards.forEach((card) => {
      const href = card.getAttribute("href");
      const imageCell = [];
      const img = card.querySelector(".article-card-image img, img");
      if (img) imageCell.push(img);
      const bodyCell = [];
      const meta = card.querySelector(".article-card-meta");
      if (meta) bodyCell.push(meta);
      const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
      if (heading) {
        if (href) {
          const link = document2.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent.trim();
          heading.textContent = "";
          heading.appendChild(link);
        }
        bodyCell.push(heading);
      }
      cells.push([imageCell, bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const items = element.querySelectorAll(":scope > details.faq-item, :scope > details, .faq-item");
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      let questionCell = "";
      if (summary) {
        const label = summary.querySelector("span");
        questionCell = label || summary.textContent.trim();
      }
      const answer = item.querySelector(".faq-answer");
      const answerCell = answer || "";
      cells.push([questionCell, answerCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
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

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections || [];
      const resolveSection = (selector) => {
        if (!selector) return null;
        const relative = selector.replace(/^#main-content\s*>\s*/, ":scope > ").replace(/^#main-content\s+/, ":scope ");
        let el = null;
        try {
          el = element.querySelector(relative);
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
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const sectionEl = resolveSection(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const block = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(block);
        }
        if (i > 0) {
          sectionEl.before(document.createElement("hr"));
        }
      }
    }
  }

  // tools/importer/import-about-us.js
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: "About page for WKND Trendsetters with hero (3 images), featured article intro, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and a full-width CTA banner.",
    urls: [
      "https://wknd-trendsetters.site/about-us"
    ],
    blocks: [
      { name: "columns-hero", instances: ["#main-content > header.section.secondary-section .grid-layout"] },
      { name: "columns-article", instances: ["#main-content > section.section:nth-of-type(1) .grid-layout"] },
      { name: "cards-gallery", instances: [".grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"] },
      { name: "tabs-testimonials", instances: ["#main-content > section.section:nth-of-type(3) .tabs-wrapper"] },
      { name: "cards-blog", instances: [".grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"] },
      { name: "accordion-faq", instances: ["#main-content > section.section:nth-of-type(5) .faq-list"] },
      { name: "hero-banner", instances: ["#main-content > section.section.inverse-section .grid-layout"] }
    ],
    sections: [
      { id: "rc2", name: "hero-intro", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["columns-hero"], defaultContent: [] },
      { id: "rc3", name: "featured-article-intro", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-article"], defaultContent: [] },
      { id: "rc4", name: "image-gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary", blocks: ["cards-gallery"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) h2", "#main-content > section.section.secondary-section:nth-of-type(2) .paragraph-lg"] },
      { id: "rc5", name: "testimonials-tabs", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-testimonials"], defaultContent: [] },
      { id: "rc6", name: "latest-articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "secondary", blocks: ["cards-blog"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) h2", "#main-content > section.section.secondary-section:nth-of-type(4) .paragraph-lg"] },
      { id: "rc7", name: "faq-accordion", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: ["#main-content > section.section:nth-of-type(5) h2", "#main-content > section.section:nth-of-type(5) .paragraph-lg"] },
      { id: "rc8", name: "cta-banner", selector: "#main-content > section.section.inverse-section", style: null, blocks: ["hero-banner"], defaultContent: [] }
    ]
  };
  var parsers = {
    "columns-hero": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonials": parse4,
    "cards-blog": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
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
  var import_about_us_default = {
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
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
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
  return __toCommonJS(import_about_us_exports);
})();
