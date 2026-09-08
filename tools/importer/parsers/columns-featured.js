/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base: columns.
 * Source: https://wknd.site/ (.teaser.cmp-teaser--featured)
 * Generated: 2026-09-07
 *
 * Library structure: flexible columns. First row = block name.
 * This variant is a 2-column layout: image (left) | text content (right).
 * Text cell holds eyebrow/pretitle, heading, description, and CTA link.
 */
export default function parse(element, { document }) {
  // Image (left column).
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Text content (right column).
  const contentCell = [];
  const eyebrow = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"], [class*="eyebrow"]');
  // Heading: prefer the teaser title, then real heading tags. Do NOT use a
  // generic [class*="title"] fallback — it also matches ".cmp-teaser__pretitle"
  // (…pre-TITLE…), which sits before the <h2> and would shadow the real title.
  let heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, h4');
  if (heading && heading === eyebrow) heading = null;
  const description = element.querySelector('.cmp-teaser__description, [class*="description"], p:not([class*="pretitle"])');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.button'));

  if (eyebrow) contentCell.push(eyebrow);
  if (heading) {
    // Normalize to an <h2> so it renders as the featured-article heading.
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    contentCell.push(h);
  }
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [image || '', contentCell.length ? contentCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
