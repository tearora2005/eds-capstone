import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-teaser-card-image';
      } else {
        div.className = 'cards-teaser-card-body';
        // The description is a bare text node after the title link. Depending on
        // whether aem.js has already wrapped loose text in a <p>, it may be a
        // direct child of the body OR a child of that <p>. Search both levels and
        // wrap it in a span so CSS can truncate it with an ellipsis (matches source).
        const scopes = [div, ...div.querySelectorAll(':scope > p')];
        scopes.forEach((scope) => {
          [...scope.childNodes].forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              const span = document.createElement('span');
              span.className = 'cards-teaser-card-desc';
              span.textContent = node.textContent.trim();
              node.replaceWith(span);
            }
          });
        });
      }
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
