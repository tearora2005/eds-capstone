/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable AEM chrome (header/nav/search/language nav, footer,
 * mobile nav, tracking iframe) and stray non-authorable elements.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Mobile nav toggle + drawer and the Adobe demdex ID-sync iframe block
    // block/pollute block matching, so remove before parsing.
    // Found in cleaned.html: <div id="toggleNav">, <div id="mobileNav">,
    // <iframe id="destination_publishing_iframe_wkndsite_0">
    WebImporter.DOMUtils.remove(element, [
      '#toggleNav',
      '#mobileNav',
      '#destination_publishing_iframe_wkndsite_0',
      // Content-fragment internal title (e.g. article pages) duplicates the
      // page H1 (.cmp-title__text) — drop it so the article body has no
      // repeated <h3> title.
      '.cmp-contentfragment__title',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. Found in cleaned.html:
    //   <header class="experiencefragment cmp-experiencefragment--header ...">
    //   <footer class="experiencefragment cmp-experiencefragment--footer ...">
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
      'iframe',
      'meta',
      'noscript',
    ]);
  }
}
