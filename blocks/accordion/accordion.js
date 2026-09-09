/*
 * Accordion Block
 * Recreate an accordion (WKND FAQ style).
 * Based on the EDS block-collection accordion, using native <details>/<summary>.
 * https://www.hlx.live/developer/block-collection/accordion
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const body = row.children[1];
    // remove a stray single-cell row (e.g. a leftover block-name row) — a valid
    // accordion item needs both a label and a body cell
    if (!label || !body) {
      row.remove();
      return;
    }
    // decorate accordion item label (question)
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body (answer)
    body.className = 'accordion-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
