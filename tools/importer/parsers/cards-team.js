/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-team. Base: cards.
 * Source: https://wknd.site/ (.experiencefragment.cmp-experience-fragment--contributor)
 * Generated: 2026-09-07
 *
 * WKND contributor/team card. Cards convention: 2 columns, first row = block name.
 * Each subsequent row = one card: [image cell (mandatory), text-content cell].
 * Text cell holds name (heading), uppercase role, and a row of social-icon links.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Image cell (circular portrait, mandatory).
  const image = element.querySelector('.cmp-image__image, .cmp-image img, img');

  // Text content cell.
  const contentCell = [];
  // Name is the first title (h3); role is the secondary title (h5).
  const name = element.querySelector('h3.cmp-title__text, .cmp-title__text');
  const role = element.querySelector('h5.cmp-title__text, .cmp-title--black .cmp-title__text');
  // Social links (Facebook / Twitter / Instagram).
  const socialLinks = Array.from(element.querySelectorAll('.buildingblock a.cmp-button, .cmp-button--icononly a, a.cmp-button'));

  if (name) contentCell.push(name);
  // Only add role if it is a distinct element from name.
  if (role && role !== name) contentCell.push(role);
  contentCell.push(...socialLinks);

  if (image || contentCell.length) {
    cells.push([image || '', contentCell.length ? contentCell : '']);
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
