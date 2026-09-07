// WKND header — content-first. All copy/links/images come from /content/nav.plain.html.
// header.js reads that DOM, builds the search control, and wires interactivity.

/**
 * Loads the nav fragment (metadata-independent dual-fetch).
 * @returns {Promise<Document|null>} parsed fragment document
 */
async function loadNavFragment() {
  // metadata-independent: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
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
 * Builds the inline search form (control lives in JS, not the fragment).
 * @returns {HTMLFormElement}
 */
function buildSearchForm() {
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.setAttribute('role', 'search');
  form.action = '/us/en/search.html';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search';
  input.setAttribute('aria-label', 'Search');
  form.append(input);
  return form;
}

/**
 * Builds the utility bar (Sign In + locale selector) from the first fragment section.
 * @param {Element} src first section of the nav fragment
 * @returns {HTMLElement}
 */
function buildUtilityBar(src) {
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility';
  if (!src) return utilityBar;
  fixImagePaths(src);

  const signIn = src.querySelector('p a');
  if (signIn) {
    const s = document.createElement('a');
    s.className = 'nav-signin';
    s.href = signIn.getAttribute('href');
    s.textContent = signIn.textContent.trim();
    utilityBar.append(s);
  }

  const localeList = src.querySelector('ul');
  if (localeList) {
    const locale = document.createElement('div');
    locale.className = 'nav-locale';
    const current = localeList.querySelector('a');
    const trigger = document.createElement('button');
    trigger.className = 'nav-locale-toggle';
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `${current ? current.innerHTML : 'EN-US'} <span class="nav-locale-caret" aria-hidden="true"></span>`;
    const list = localeList.cloneNode(true);
    list.className = 'nav-locale-list';
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
      locale.classList.toggle('open', !open);
    });
    document.addEventListener('click', (e) => {
      if (!locale.contains(e.target)) {
        trigger.setAttribute('aria-expanded', 'false');
        locale.classList.remove('open');
      }
    });
    locale.append(trigger, list);
    utilityBar.append(locale);
  }
  return utilityBar;
}

/**
 * loads and decorates the header nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const doc = await loadNavFragment();
  block.textContent = '';
  if (!doc) return;

  const sections = [...doc.body.children];
  const [utilitySrc, brandSrc, navSrc] = sections;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const utilityBar = buildUtilityBar(utilitySrc);

  // --- Main bar: hamburger + logo + nav links + search ---
  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main';

  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.type = 'button';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSrc) {
    fixImagePaths(brandSrc);
    const logoLink = brandSrc.querySelector('a');
    if (logoLink) brand.append(logoLink.cloneNode(true));
  }

  const linksWrap = document.createElement('div');
  linksWrap.className = 'nav-links';
  if (navSrc) {
    const list = navSrc.querySelector('ul');
    if (list) linksWrap.append(list.cloneNode(true));
  }
  linksWrap.append(buildSearchForm());

  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    hamburger.classList.toggle('open', !open);
    linksWrap.classList.toggle('open', !open);
    hamburger.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  });

  mainBar.append(hamburger, brand, linksWrap);
  nav.append(utilityBar, mainBar);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // --- Viewport resize handling: reset mobile state when crossing to desktop ---
  const desktopMq = window.matchMedia('(width >= 900px)');
  const onChange = (e) => {
    if (e.matches) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-label', 'Open navigation');
      linksWrap.classList.remove('open');
    }
  };
  if (desktopMq.addEventListener) desktopMq.addEventListener('change', onChange);
}
