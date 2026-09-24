// Keep only the editor's supported markup when saving and when reading from
// prototype storage. In particular, never trust a saved link or CSS declaration.
const allowedTags = new Set([
  'P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'UL', 'OL', 'LI',
  'H1', 'H2', 'SUP', 'SUB', 'BLOCKQUOTE', 'A', 'SPAN', 'FONT',
]);

const fontSizes: Record<string, string> = {
  '1': '10px', '2': '13px', '3': '16px', '4': '18px',
  '5': '24px', '6': '32px', '7': '48px',
  'xx-small': '10px', 'x-small': '10px', 'small': '13px',
  'medium': '16px', 'large': '18px', 'x-large': '24px', 'xx-large': '32px',
};

function safeColor(value: string) {
  const color = value.trim();
  return /^#[\da-f]{3,8}$/i.test(color) ||
    /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(color)
    ? color : '';
}

export function safeRichTextUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

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
    if (!(node instanceof Element) ||
      ['SCRIPT', 'STYLE', 'SVG', 'MATH', 'IFRAME', 'OBJECT', 'IMG'].includes(node.tagName)) return;

    const tag = node.tagName === 'FONT' ? 'span' : node.tagName.toLowerCase();
    const target = allowedTags.has(node.tagName) ? document.createElement(tag) : parent;
    if (target instanceof HTMLElement && target !== parent) {
      const sourceStyle = (node as HTMLElement).style;
      const color = safeColor(sourceStyle.color || node.getAttribute('color') || '');
      const background = safeColor(sourceStyle.backgroundColor);
      const rawFontSize = node.tagName === 'FONT'
        ? node.getAttribute('size') || '' : sourceStyle.fontSize;
      const fontSize = fontSizes[rawFontSize] || rawFontSize;
      if (color) target.style.color = color;
      if (background) target.style.backgroundColor = background;
      if (fontSize && Object.values(fontSizes).includes(fontSize)) target.style.fontSize = fontSize;
      if (['left', 'center', 'right', 'justify'].includes(sourceStyle.textAlign)) {
        target.style.textAlign = sourceStyle.textAlign;
      }
      const margin = sourceStyle.marginLeft.match(/^(\d{1,3})px$/);
      if (margin && Number(margin[1]) <= 160) target.style.marginLeft = sourceStyle.marginLeft;
      if (node.tagName === 'A') {
        const href = safeRichTextUrl(node.getAttribute('href') || '');
        if (href) {
          target.setAttribute('href', href);
          target.setAttribute('target', '_blank');
          target.setAttribute('rel', 'noopener noreferrer');
        }
      }
    }
    node.childNodes.forEach(child => appendClean(child, target));
    if (target !== parent) parent.appendChild(target);
  };

  source.childNodes.forEach(node => appendClean(node, clean));
  return clean.innerHTML;
}
