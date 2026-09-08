/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND adventure-listing cleanup.
 * The source page renders one .image-list.list grid per category (All,
 * Climbing, Cycling, ...) plus a static <ol> of category tabs. The migrated
 * page uses a single dynamic `listing` block with a client-side filter bar, so:
 *   - keep only the FIRST .image-list.list (the "All" grid → becomes listing)
 *   - remove the remaining per-category grids
 *   - remove the static category <ol> tabs (JS rebuilds them from tags)
 *
 * Runs in beforeTransform, before the listing parser replaces the grid.
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;

  const grids = element.querySelectorAll('.image-list.list');
  grids.forEach((grid, i) => {
    if (i > 0) grid.remove();
  });

  // Remove the static category tab list: an <ol> whose items are the category
  // names. Identify it as an <ol> immediately followed by (or preceding) the
  // grid, containing an "All" item.
  element.querySelectorAll('ol').forEach((ol) => {
    const items = [...ol.querySelectorAll('li')].map((li) => li.textContent.trim().toLowerCase());
    if (items.length && items[0] === 'all') ol.remove();
  });
}
