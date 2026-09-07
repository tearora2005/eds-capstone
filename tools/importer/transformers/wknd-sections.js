/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND section breaks and section metadata for the home-landing
 * template. Inserts <hr> before every non-first section (in beforeTransform,
 * while section elements still exist) and a Section Metadata block for every
 * section that declares a style (in afterTransform, anchored to a marker <hr>).
 *
 * Selectors come from payload.template.sections (DOM-verified during analysis).
 * Note: sections "Recent Articles" and "Where do you want to go" share the
 * selector `.image-list.list` (two DOM instances). Elements are resolved once
 * in document order by occurrence index so each section maps to the correct
 * instance rather than both collapsing onto the first match.
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

function resolveSectionElements(element, sections) {
  const selectorCounts = {};
  return sections.map((section) => {
    const idx = selectorCounts[section.selector] || 0;
    selectorCounts[section.selector] = idx + 1;
    const matches = element.querySelectorAll(section.selector);
    return matches[idx] || null;
  });
}

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Resolve each section to its DOM instance (occurrence-aware) once, before
    // parsers can replace any section element.
    const sectionEls = resolveSectionElements(element, sections);

    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break needed
      const sectionEl = sectionEls[i];
      if (!sectionEl) continue; // selector didn't match — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Insert Section Metadata for styled sections, anchored to the marker <hr>
    // placed above (survives parser replacement of the original element).
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
