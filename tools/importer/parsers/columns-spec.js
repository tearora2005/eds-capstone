/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-spec. Base: columns.
 * Source: https://wknd.site/ (.contentfragment.cmp-contentfragment--elements)
 * Generated: 2026-09-07
 *
 * Adventure spec/metadata list. Columns convention: first row = block name;
 * every subsequent row has the same column count as the second row (here: 2).
 * Each subsequent row = one label/value pair: [label cell, value cell].
 * Built from AEM contentfragment elements (.cmp-contentfragment__element with
 * __element-title = label and __element-value = value).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each content-fragment element is one label/value spec row.
  const specs = element.querySelectorAll('.cmp-contentfragment__element');

  specs.forEach((spec) => {
    const label = spec.querySelector('.cmp-contentfragment__element-title, dt');
    const value = spec.querySelector('.cmp-contentfragment__element-value, dd');

    // Keep every row 2-column, padding a missing side with an empty cell.
    if (label || value) {
      cells.push([label || '', value || '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-spec', cells });
  element.replaceWith(block);
}
