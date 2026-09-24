// Keep only the formatting offered by the rejection editor. The saved HTML is
// also cleaned when displayed because prototype state can be edited in storage.
const allowedTags = new Set([
  'P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'H1', 'H2',
]);

export function richTextPlainText(html: string) {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent
    ?.replace(/\u00a0/g, ' ').trim() ?? '';
}

export function sanitizeRichText(html: string) {
  const source = new DOMParser().parseFromString(html, 'text/html').body;
  const clean = document.createElement('div');

  const appendClean = (node: Node, parent: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.appendChild(document.createTextNode(node.textContent ?? ''));
      return;
    }
    if (!(node instanceof Element) || ['SCRIPT', 'STYLE', 'SVG', 'MATH'].includes(node.tagName)) return;
    const target = allowedTags.has(node.tagName)
      ? document.createElement(node.tagName.toLowerCase())
      : parent;
    node.childNodes.forEach(child => appendClean(child, target));
    if (target !== parent) parent.appendChild(target);
  };

  source.childNodes.forEach(node => appendClean(node, clean));
  return clean.innerHTML;
}
