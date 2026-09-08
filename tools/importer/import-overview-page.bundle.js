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

  // tools/importer/import-overview-page.js
  var import_overview_page_exports = {};
  __export(import_overview_page_exports, {
    default: () => import_overview_page_default
  });

  // tools/importer/parsers/cards-team.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const image = element.querySelector(".cmp-image__image, .cmp-image img, img");
    const contentCell = [];
    const name = element.querySelector("h3.cmp-title__text, .cmp-title__text");
    const role = element.querySelector("h5.cmp-title__text, .cmp-title--black .cmp-title__text");
    const socialLinks = Array.from(element.querySelectorAll(".buildingblock a.cmp-button, .cmp-button--icononly a, a.cmp-button"));
    if (name) contentCell.push(name);
    if (role && role !== name) contentCell.push(role);
    contentCell.push(...socialLinks);
    if (image || contentCell.length) {
      cells.push([image || "", contentCell.length ? contentCell : ""]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-team", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const contentCell = [];
    const eyebrow = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"], [class*="eyebrow"]');
    let heading = element.querySelector(".cmp-teaser__title, h1, h2, h3, h4");
    if (heading && heading === eyebrow) heading = null;
    const description = element.querySelector('.cmp-teaser__description, [class*="description"], p:not([class*="pretitle"])');
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a, a.button"));
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) {
      const h = document2.createElement("h2");
      h.textContent = heading.textContent.trim();
      contentCell.push(h);
    }
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    if (!image && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [image || "", contentCell.length ? contentCell : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/listing.js
  function parse3(element, { document: document2, url, params }) {
    const pageUrl = params && params.originalURL || url || "";
    let pathname = "";
    try {
      pathname = new URL(pageUrl).pathname.replace(/\.html?$/, "").replace(/\/$/, "");
    } catch (e) {
      pathname = "";
    }
    let source = "";
    const links = element.querySelectorAll("a[href]");
    for (let i = 0; i < links.length; i += 1) {
      let href = links[i].getAttribute("href") || "";
      try {
        href = new URL(href, "https://wknd.site").pathname;
      } catch (e) {
      }
      href = href.replace(/\.html?$/, "");
      const slash = href.lastIndexOf("/");
      if (slash > 0) {
        source = href.slice(0, slash + 1);
        break;
      }
    }
    const isHome = pathname === "" || /\/(us|ca)\/(en|fr|es)$/.test(pathname) || /\/index$/.test(pathname);
    const isAdventuresListing = /\/adventures$/.test(pathname);
    const rows = [];
    if (source) rows.push(["source", source]);
    if (isHome) rows.push(["limit", "4"]);
    if (isAdventuresListing) rows.push(["filter", "true"]);
    const cells = [["listing"], ...rows];
    const block = WebImporter.Blocks.createBlock(document2, { name: "listing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-secure.js
  function parse4(element, { document: document2 }) {
    const teasers = [element];
    let sib = element.nextElementSibling;
    while (sib) {
      if (sib.classList && sib.classList.contains("cmp-teaser--secure")) teasers.push(sib);
      sib = sib.nextElementSibling;
    }
    const cells = [];
    teasers.forEach((teaser) => {
      const image = teaser.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
      const contentCell = [];
      const title = teaser.querySelector('.cmp-teaser__title, [class*="title"], h1, h2, h3');
      const description = teaser.querySelector('.cmp-teaser__description, [class*="description"], p');
      const cta = teaser.querySelector(".cmp-teaser__action-link, .cmp-button, a");
      if (title) {
        const h = document2.createElement("h3");
        h.textContent = title.textContent.trim();
        contentCell.push(h);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        contentCell.push(p);
      }
      if (cta && cta.getAttribute("href")) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", cta.getAttribute("href"));
        a.textContent = (cta.textContent || "Read More").trim() || "Read More";
        p.append(a);
        contentCell.push(p);
      }
      cells.push([image, contentCell]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-secure", cells });
    teasers.slice(1).forEach((t) => t.remove());
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#toggleNav",
        "#mobileNav",
        "#destination_publishing_iframe_wkndsite_0",
        // Content-fragment internal title (e.g. article pages) duplicates the
        // page H1 (.cmp-title__text) — drop it so the article body has no
        // repeated <h3> title.
        ".cmp-contentfragment__title"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header",
        "footer.cmp-experiencefragment--footer",
        "iframe",
        "meta",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function resolveSectionElements(element, sections) {
    const selectorCounts = {};
    return sections.map((section) => {
      const idx = selectorCounts[section.selector] || 0;
      selectorCounts[section.selector] = idx + 1;
      const matches = element.querySelectorAll(section.selector);
      return matches[idx] || null;
    });
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      const sectionEls = resolveSectionElements(element, sections);
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = sectionEls[i];
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-overview-page.js
  var PAGE_TEMPLATE = {
    "name": "overview-page",
    "description": "Section overview page with intro heading and card-grid listing of child items",
    "urls": [
      "https://wknd.site/ca/en/about-us.html"
    ],
    "blocks": [
      {
        "name": "cards-team",
        "instances": [
          ".experiencefragment.cmp-experience-fragment--contributor"
        ]
      },
      {
        "name": "columns-featured",
        "instances": [
          ".teaser.cmp-teaser--featured"
        ]
      },
      {
        "name": "listing",
        "instances": [
          ".image-list.list"
        ]
      },
      {
        "name": "cards-secure",
        "instances": [
          ".teaser.cmp-teaser--secure"
        ]
      }
    ]
  };
  var parsers = {
    "cards-team": parse,
    "columns-featured": parse2,
    listing: parse3,
    "cards-secure": parse4
  };
  var transformers = [
    transform,
    transform2
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
  var import_overview_page_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
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
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
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
  return __toCommonJS(import_overview_page_exports);
})();
