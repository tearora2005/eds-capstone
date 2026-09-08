/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://wknd.site/ (.teaser.cmp-teaser--hero.cmp-teaser--imagebottom)
 * Generated: 2026-09-07
 *
 * Library structure: 1-column hero. First row = block name.
 * Row 2 = background image cell (optional).
 * Row 3 = content cell: title (heading), subheading/paragraph, CTA link.
 */
export default function parse(element, { document }) {
  // Background image (row 2).
  const bgImage = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Content (row 3).
  const contentCell = [];
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
  const description = element.querySelector('.cmp-teaser__description, [class*="description"], p');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.button'));

  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (!bgImage && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 2: background image (1-column: single cell holding the image).
  if (bgImage) cells.push([bgImage]);
  // Row 3: content (1-column: single cell holding all content elements).
  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
