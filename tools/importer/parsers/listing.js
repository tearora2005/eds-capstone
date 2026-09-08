/* eslint-disable */
/* global WebImporter */
/**
 * Parser for listing. Base: cards.
 * Source: https://wknd.site/ (.image-list.list)
 *
 * Replaces a static card grid with a listing block whose cards are rendered at
 * runtime from the site's query-index.json. Emits config rows:
 *   | listing |                    |
 *   | source  | /us/en/magazine/   (derived from existing card links)
 *   | limit   | 4                  (home listings only; 0/omitted = all)
 *   | filter  | true               (adventures listing only)
 *
 * source is derived from the directory of the first internal card link, so
 * each list resolves to its own collection (magazine vs adventures) even when
 * two lists share the .image-list.list selector on the home page.
 */
export default function parse(element, { document, url, params }) {
  const pageUrl = (params && params.originalURL) || url || '';
  let pathname = '';
  try {
    pathname = new URL(pageUrl).pathname.replace(/\.html?$/, '').replace(/\/$/, '');
  } catch (e) {
    pathname = '';
  }

  // Derive the collection prefix from the first internal card link's directory.
  let source = '';
  const links = element.querySelectorAll('a[href]');
  for (let i = 0; i < links.length; i += 1) {
    let href = links[i].getAttribute('href') || '';
    // Normalize to a pathname, dropping origin and .html.
    try {
      href = new URL(href, 'https://wknd.site').pathname;
    } catch (e) {
      // leave as-is
    }
    href = href.replace(/\.html?$/, '');
    const slash = href.lastIndexOf('/');
    if (slash > 0) {
      source = href.slice(0, slash + 1); // directory prefix incl. trailing slash
      break;
    }
  }

  // Home listings show the 4 newest; magazine/adventures listings show all.
  const isHome = pathname === '' || /\/(us|ca)\/(en|fr|es)$/.test(pathname) || /\/index$/.test(pathname);
  const isAdventuresListing = /\/adventures$/.test(pathname);

  const rows = [];
  if (source) rows.push(['source', source]);
  if (isHome) rows.push(['limit', '4']);
  if (isAdventuresListing) rows.push(['filter', 'true']);

  const cells = [['listing'], ...rows];
  const block = WebImporter.Blocks.createBlock(document, { name: 'listing', cells });
  element.replaceWith(block);
}
