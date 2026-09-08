import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-secure — WKND "Members Only" teaser cards (Alaskan Adventure, Fly Fishing).
 * Same card transformation as cards-teaser: each row → <li> with image + body,
 * rendered side-by-side by the CSS grid.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-secure-card-image';
      else div.className = 'cards-secure-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
