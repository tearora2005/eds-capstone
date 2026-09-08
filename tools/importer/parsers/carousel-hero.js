/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/ (.carousel.cmp-carousel--hero)
 * Generated: 2026-09-07
 *
 * Library structure: 2-column carousel. First row = block name.
 * Each subsequent row = one slide: [image cell, text-content cell].
 * Text cell holds title (heading), description, and CTA link.
 */
export default function parse(element, { document }) {
  // Each carousel item is a slide.
  const slides = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  slides.forEach((slide) => {
    // Image cell (mandatory).
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

    // Text content cell.
    const contentCell = [];
    const title = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = slide.querySelector('.cmp-teaser__description, [class*="description"], p');
    const ctaLinks = Array.from(slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.button'));

    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);

    // Only add a slide row when there is content to show.
    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
