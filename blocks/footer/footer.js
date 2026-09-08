// WKND footer — content-first. All copy/links/images come from /content/footer.plain.html.
// footer.js reads that DOM and renders; it never hardcodes copy.

/**
 * Loads the footer fragment (metadata-independent dual-fetch).
 * @returns {Promise<Document|null>} parsed fragment document
 */
async function loadFooterFragment() {
  // metadata-independent: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Rewrites relative image paths (images/x.svg) to absolute (/content/images/x.svg).
 * @param {Element} scope element whose <img> descendants to rewrite
 */
function fixImagePaths(scope) {
  scope.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('/')) {
      img.setAttribute('src', `/content/${src}`);
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const doc = await loadFooterFragment();
  block.textContent = '';
  if (!doc) return;

  const sections = [...doc.body.children];
  const [brandSrc, socialSrc, legalSrc] = sections;

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // Top row: brand + nav (left) and social block (right)
  const topRow = document.createElement('div');
  topRow.className = 'footer-top';

  const brand = document.createElement('div');
  brand.className = 'footer-brand';
  if (brandSrc) {
    fixImagePaths(brandSrc);
    while (brandSrc.firstElementChild) brand.append(brandSrc.firstElementChild);
  }

  const social = document.createElement('div');
  social.className = 'footer-social';
  if (socialSrc) {
    fixImagePaths(socialSrc);
    while (socialSrc.firstElementChild) social.append(socialSrc.firstElementChild);
  }

  topRow.append(brand, social);

  // Legal / description block
  const legal = document.createElement('div');
  legal.className = 'footer-legal';
  if (legalSrc) {
    while (legalSrc.firstElementChild) legal.append(legalSrc.firstElementChild);
  }

  footer.append(topRow, legal);
  block.append(footer);
}
