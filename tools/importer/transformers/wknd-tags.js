/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND adventure tags.
 * Reads the adventure's "Activity" content-fragment element (e.g. Surfing,
 * Cycling, Skiing, Climbing, Travel) and stashes it on the root element so the
 * import script can append a "Tags" row to the generated Metadata block (after
 * WebImporter.rules.createMetadata has run). That Tags value drives the
 * query-index `tags` column and the Adventures category filter.
 *
 * Must run in beforeTransform, before columns-spec replaces the fragment DOM.
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;

  const specs = element.querySelectorAll('.cmp-contentfragment__element');
  let activity = '';
  specs.forEach((spec) => {
    const label = spec.querySelector('.cmp-contentfragment__element-title, dt');
    const value = spec.querySelector('.cmp-contentfragment__element-value, dd');
    if (label && value && label.textContent.trim().toLowerCase() === 'activity') {
      activity = value.textContent.trim();
    }
  });

  if (activity) element.setAttribute('data-excat-tags', activity);
}
