/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsSpecParser from './parsers/columns-spec.js';
import tabsDetailParser from './parsers/tabs-detail.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';
import tagsTransformer from './transformers/wknd-tags.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "adventure-detail",
  "description": "Detail page with hero image, title, metadata bar and long-form body content",
  "urls": [
    "https://wknd.site/ca/en/adventures/bali-surf-camp.html"
  ],
  "blocks": [
    {
      "name": "carousel-hero",
      "instances": [
        ".carousel.cmp-carousel--mini"
      ]
    },
    {
      "name": "columns-spec",
      "instances": [
        ".contentfragment.cmp-contentfragment--elements"
      ]
    },
    {
      "name": "tabs-detail",
      "instances": [
        ".tabs.panelcontainer"
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-spec': columnsSpecParser,
  'tabs-detail': tabsDetailParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
  tagsTransformer,
];

/**
 * Appends a "Category" row to the generated Metadata block, using the activity
 * value stashed on the root by the tags transformer. Produces
 * <meta name="category"> on the published page, which the query-index `tags`
 * column reads (via meta[name="category"]).
 * @param {Element} main root element (after createMetadata has run)
 * @param {Document} document
 */
function appendTagsMetadata(main, document) {
  const tags = main.getAttribute('data-excat-tags');
  main.removeAttribute('data-excat-tags');
  if (!tags) return;

  // The metadata block is a two-column table whose first cell is the key.
  const tables = main.querySelectorAll('table');
  const metaTable = [...tables].find((t) => {
    const first = t.querySelector('tr th, tr td');
    return first && /metadata/i.test(first.textContent);
  });
  if (!metaTable) return;

  const body = metaTable.querySelector('tbody') || metaTable;
  // Use "Category" (not "Tags") as the metadata key: EDS maps a "Tags" key to
  // <meta property="article:tag">, which the query-index scraper does not
  // expose. "Category" emits a plain <meta name="category"> the index can read.
  const tr = document.createElement('tr');
  const keyCell = document.createElement('td');
  keyCell.textContent = 'Category';
  const valCell = document.createElement('td');
  valCell.textContent = tags;
  tr.append(keyCell, valCell);
  body.append(tr);
}

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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    appendTagsMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

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
