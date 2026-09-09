/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion. Base: accordion.
 * Source: https://wknd.site/us/en/faqs.html (.accordion.panelcontainer)
 *
 * Convention: 2-column table. First row = block name only. Each subsequent row
 * is one accordion item with 2 cells: [title cell, content cell].
 *   - Title cell: the clickable question (from .cmp-accordion__title).
 *   - Content cell: the answer body shown when expanded (from .cmp-accordion__panel).
 */
export default function parse(element, { document }) {
  const cells = [['accordion']];

  element.querySelectorAll('.cmp-accordion__item').forEach((item) => {
    const title = item.querySelector('.cmp-accordion__title');
    const panel = item.querySelector('.cmp-accordion__panel');
    if (!title || !panel) return;

    // title cell: the question text
    const titleCell = document.createElement('p');
    titleCell.textContent = title.textContent.trim();

    // content cell: the answer body, unwrapped from AEM container/text scaffolding
    const contentCell = document.createElement('div');
    const content = panel.querySelectorAll('.cmp-text > *, p, ul, ol');
    if (content.length) {
      content.forEach((el) => {
        // skip empty scaffolding nodes (e.g. stray <h3></h3> in the source panel)
        if (!el.textContent.trim() && !el.querySelector('img, picture, a')) return;
        contentCell.append(el.cloneNode(true));
      });
    } else {
      contentCell.innerHTML = panel.innerHTML;
    }

    cells.push([titleCell, contentCell]);
  });

  // Empty-block guard.
  if (cells.length === 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
