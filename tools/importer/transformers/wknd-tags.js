/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND adventure tags.
 * Reads the adventure's "Activity" content-fragment element (e.g. Surfing,
 * Cycling, Skiing, Climbing, Travel) and stashes it on the root element so the
 * import script can append a "Category" row to the generated Metadata block
 * (after WebImporter.rules.createMetadata has run). That value drives the
 * query-index `tags` column and the Adventures category filter.
 *
 * Must run in beforeTransform, before columns-spec replaces the fragment DOM.
 */
// Map raw source Activity values onto the site's category tabs
// (All / Climbing / Cycling / Skiing / Surfing / Travel). The source uses finer
// activities (e.g. "Rock Climbing", "Camping", "Social") that must roll up to
// the coarser tab labels wknd.site groups them under.
const CATEGORY_MAP = {
  'rock climbing': 'Climbing',
  camping: 'Travel',
  social: 'Travel',
};

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

  if (activity) {
    const category = CATEGORY_MAP[activity.toLowerCase()] || activity;
    element.setAttribute('data-excat-tags', category);
  }
}
