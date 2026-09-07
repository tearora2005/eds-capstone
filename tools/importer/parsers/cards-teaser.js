/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-teaser. Base: cards.
 * Source: https://wknd.site/ (.image-list.list)
 * Generated: 2026-09-07
 *
 * Library structure: 2-column cards (images present). First row = block name.
 * Each subsequent row = one card: [image cell, text-content cell].
 * Text cell holds title (heading/link) and short description.
 */
export default function parse(element, { document }) {
  // Each list item is a teaser card.
  const items = element.querySelectorAll('.cmp-image-list__item, li');
  const cells = [];

  items.forEach((item) => {
    // Image cell (mandatory).
    const image = item.querySelector('.cmp-image-list__item-image img, .cmp-image__image, img');

    // Text content cell.
    const contentCell = [];
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title, [class*="title"]');
    const description = item.querySelector('.cmp-image-list__item-description, [class*="description"], p');

    // Prefer the linked title (preserves the CTA href); fall back to plain title text.
    if (titleLink) {
      contentCell.push(titleLink);
    } else if (titleText) {
      contentCell.push(titleText);
    }
    if (description) contentCell.push(description);

    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
