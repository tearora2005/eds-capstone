import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * listing — data-driven card listing. Renders the same card design as
 * cards-teaser, but sourced at runtime from the site's published
 * query-index.json instead of hard-coded content, so new/edited articles and
 * adventures appear automatically.
 *
 * Authored config (block rows, all optional):
 *   | source | /us/en/magazine/ |   path prefix to list (defaults to current dir)
 *   | limit  | 4                |   max cards, newest first (0/omit = all)
 *   | filter | true             |   show category filter tabs (adventures)
 *
 * The index must expose: path, title, description, image, lastModified, tags.
 */

const INDEX_PATH = '/query-index.json';

/**
 * Reads the authored key/value rows into a config object.
 * @param {Element} block
 * @returns {{source:string, limit:number, filter:boolean}}
 */
function readConfig(block) {
  const cfg = { source: '', limit: 0, filter: false };
  [...block.children].forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    const val = cells[1].textContent.trim();
    if (key === 'source') cfg.source = val;
    else if (key === 'limit') cfg.limit = parseInt(val, 10) || 0;
    else if (key === 'filter') cfg.filter = /^(true|yes|on|1)$/i.test(val);
  });
  return cfg;
}

/**
 * Fetches and parses the query index.
 * @returns {Promise<Array<object>>} index rows (empty array on failure)
 */
async function fetchIndex() {
  try {
    const resp = await fetch(INDEX_PATH);
    if (!resp.ok) return [];
    const json = await resp.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (e) {
    return [];
  }
}

/**
 * Selects, filters, and sorts rows for a given source prefix.
 * Only DIRECT children of the prefix are listed (one path segment deep), so a
 * magazine listing shows articles but not nested folders like members-only/.
 * @param {Array<object>} rows
 * @param {string} source path prefix (e.g. /us/en/magazine/)
 * @param {number} limit
 * @returns {Array<object>}
 */
function selectRows(rows, source, limit) {
  const prefix = source.endsWith('/') ? source : `${source}/`;
  const items = rows
    .filter((r) => {
      if (!r.path || !r.path.startsWith(prefix)) return false;
      const rest = r.path.slice(prefix.length);
      // direct child only: no further slash (ignoring a trailing one)
      return rest.length > 0 && !rest.replace(/\/$/, '').includes('/');
    })
    .sort((a, b) => {
      const da = parseInt(a.lastModified, 10) || 0;
      const db = parseInt(b.lastModified, 10) || 0;
      return db - da; // newest first
    });
  return limit > 0 ? items.slice(0, limit) : items;
}

/**
 * Splits a tags cell (JSON array or comma-separated) into clean values.
 * @param {string} raw
 * @returns {string[]}
 */
function parseTags(raw) {
  if (!raw) return [];
  let list = [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) list = parsed;
    else list = String(raw).split(',');
  } catch (e) {
    list = String(raw).split(',');
  }
  return list.map((t) => String(t).trim()).filter(Boolean);
}

/**
 * Builds one card <li> matching the cards-teaser markup/classes.
 * @param {object} row index row
 * @returns {HTMLLIElement}
 */
function buildCard(row) {
  const li = document.createElement('li');
  const tags = parseTags(row.tags);
  if (tags.length) li.dataset.tags = tags.join('|').toLowerCase();

  // image cell
  const imageCell = document.createElement('div');
  imageCell.className = 'cards-teaser-card-image';
  if (row.image) {
    const pic = createOptimizedPicture(row.image, row.title || '', false, [{ width: '750' }]);
    imageCell.append(pic);
  }

  // body cell: uppercase title link + truncated description span
  const body = document.createElement('div');
  body.className = 'cards-teaser-card-body';
  const link = document.createElement('a');
  link.href = row.path;
  link.textContent = row.title || row.path;
  body.append(link);
  if (row.description) {
    const desc = document.createElement('span');
    desc.className = 'cards-teaser-card-desc';
    desc.textContent = row.description;
    body.append(desc);
  }

  li.append(imageCell, body);
  return li;
}

/**
 * Builds the category filter bar and wires live filtering over the cards.
 * Categories are derived from the union of card tags, plus a leading "All".
 * @param {HTMLUListElement} ul the rendered card list
 * @returns {HTMLElement}
 */
function buildFilterBar(ul) {
  const tagSet = new Set();
  ul.querySelectorAll('li[data-tags]').forEach((li) => {
    li.dataset.tags.split('|').forEach((t) => t && tagSet.add(t));
  });
  const cats = ['all', ...[...tagSet].sort()];

  const bar = document.createElement('ul');
  bar.className = 'listing-filters';
  cats.forEach((cat, i) => {
    const item = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = cat === 'all' ? 'All' : cat.replace(/\b\w/g, (c) => c.toUpperCase());
    btn.dataset.cat = cat;
    if (i === 0) btn.setAttribute('aria-current', 'true');
    btn.addEventListener('click', () => {
      bar.querySelectorAll('button').forEach((b) => b.removeAttribute('aria-current'));
      btn.setAttribute('aria-current', 'true');
      ul.querySelectorAll(':scope > li').forEach((li) => {
        const match = cat === 'all' || (li.dataset.tags || '').split('|').includes(cat);
        li.hidden = !match;
      });
    });
    item.append(btn);
    bar.append(item);
  });
  return bar;
}

/**
 * @param {Element} block
 */
export default async function decorate(block) {
  const cfg = readConfig(block);
  block.textContent = '';

  // Default source to the current directory when not authored.
  const source = cfg.source || window.location.pathname.replace(/[^/]*$/, '');

  const rows = await fetchIndex();
  const items = selectRows(rows, source, cfg.limit);

  if (!items.length) {
    // Graceful fallback: leave the block empty rather than showing an error.
    return;
  }

  const ul = document.createElement('ul');
  items.forEach((row) => ul.append(buildCard(row)));

  if (cfg.filter) block.append(buildFilterBar(ul));
  block.append(ul);
}
