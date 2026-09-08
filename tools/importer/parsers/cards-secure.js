/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-secure. Base: cards.
 * Source: https://wknd.site/us/en/magazine.html (.teaser.cmp-teaser--secure)
 *
 * The "Members Only" section is a row of adjacent .cmp-teaser--secure cards
 * (Alaskan Adventure, Fly Fishing the Amazon). The block is mapped on the FIRST
 * secure teaser; this parser collects that teaser plus any following-sibling
 * secure teasers into a single cards block so they render as a side-by-side grid.
 *
 * Library structure: 2-column cards. First row = block name.
 * Each subsequent row = one card: [image cell, text-content cell].
 * Text cell holds title (heading), description, and CTA link.
 */
export default function parse(element, { document }) {
  // Collect this secure teaser + adjacent following secure teasers.
  const teasers = [element];
  let sib = element.nextElementSibling;
  while (sib) {
    if (sib.classList && sib.classList.contains('cmp-teaser--secure')) teasers.push(sib);
    sib = sib.nextElementSibling;
  }

  const cells = [];
  teasers.forEach((teaser) => {
    const image = teaser.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

    const contentCell = [];
    const title = teaser.querySelector('.cmp-teaser__title, [class*="title"], h1, h2, h3');
    const description = teaser.querySelector('.cmp-teaser__description, [class*="description"], p');
    const cta = teaser.querySelector('.cmp-teaser__action-link, .cmp-button, a');

    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      contentCell.push(h);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }
    if (cta && cta.getAttribute('href')) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href'));
      a.textContent = (cta.textContent || 'Read More').trim() || 'Read More';
      p.append(a);
      contentCell.push(p);
    }

    cells.push([image, contentCell]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-secure', cells });

  // Remove the extra secure teasers we absorbed, then replace the first with the block.
  teasers.slice(1).forEach((t) => t.remove());
  element.replaceWith(block);
}
