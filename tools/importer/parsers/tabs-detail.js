/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-detail. Base: tabs.
 * Source: https://wknd.site/ (.tabs.panelcontainer)
 * Generated: 2026-09-07
 *
 * Adventure-detail 3-tab content switcher (Overview / Itinerary / What to Bring).
 * Tabs convention: 2 columns, first row = block name; each subsequent row = one tab:
 * [tab label cell (mandatory), tab panel content cell (mandatory)].
 * AEM tabs: .cmp-tabs__tab (labels), .cmp-tabs__tabpanel (panel content).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Tab labels (ordered) and their corresponding panels (ordered).
  const tabs = Array.from(element.querySelectorAll('.cmp-tabs__tab'));
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  tabs.forEach((tab, index) => {
    const panel = panels[index];

    // Panel content: prefer the meaningful inner content of the content fragment.
    let panelContent = '';
    if (panel) {
      const article = panel.querySelector('.cmp-contentfragment__elements, .cmp-contentfragment, article');
      panelContent = article || panel;
    }

    // Label cell holds the tab text; content cell holds the panel body.
    const label = (tab.textContent || '').trim();
    if (label || panelContent) {
      cells.push([label || '', panelContent || '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-detail', cells });
  element.replaceWith(block);
}
