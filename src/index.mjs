// MyST plugin + anywidget that turns figures and images on a page into a
// clickable lightbox gallery via GLightbox (loaded from a CDN at runtime).

let pathMod;
try { pathMod = await import('node:path'); } catch {}
const PLUGIN_PATH = new URL(import.meta.url).pathname;

const GLIGHTBOX_VERSION = '3.3.0';
const GLIGHTBOX_CSS = `https://cdn.jsdelivr.net/npm/glightbox@${GLIGHTBOX_VERSION}/dist/css/glightbox.min.css`;
const GLIGHTBOX_ESM = `https://cdn.jsdelivr.net/npm/glightbox@${GLIGHTBOX_VERSION}/+esm`;
const LINK_CLASS = 'myst-lightbox-link';
const STYLE_ID = 'myst-lightbox-style';
// SVGs rendered via <img> take their intrinsic (often tiny) viewBox size,
// so the lightbox shows them smaller than they appear on the page. Give SVGs
// an explicit large box and use object-fit so they scale up while keeping
// their aspect ratio. Raster images already fit naturally and are left alone.
const LIGHTBOX_CSS = `
  .gslide-image img[src*=".svg"],
  .gslide-image img[src^="data:image/svg"] {
    width: 90vw;
    height: 85vh;
    object-fit: contain;
  }
`;
// Inline SVGs smaller than this in both dimensions are treated as decoration
// (icons, copy buttons, etc.) and skipped.
const SVG_MIN_SIZE = 100;

async function render({ el }) {
  el.style.display = 'none';

  if (!document.querySelector(`link[href="${GLIGHTBOX_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GLIGHTBOX_CSS;
    document.head.appendChild(link);
  }
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = LIGHTBOX_CSS;
    document.head.appendChild(style);
  }

  // Scope to the article body so theme chrome (logos, icons) is excluded.
  const content = document.querySelector('article.article, main') || document.body;

  const captionOf = (node) =>
    node.closest('figure')?.querySelector('figcaption')?.innerHTML?.trim() || '';

  const wrapInLightbox = (node, href, title, caption, type) => {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.className = LINK_CLASS;
    anchor.style.cursor = 'zoom-in';
    if (title) anchor.dataset.title = title;
    if (caption) anchor.dataset.description = caption;
    // GLightbox auto-detects type from the URL extension, which fails for
    // data: URLs. Pass an explicit type when callers know it.
    if (type) anchor.dataset.glightbox = `type: ${type}`;
    node.parentNode.insertBefore(anchor, node);
    anchor.appendChild(node);
  };

  content.querySelectorAll('img').forEach((img) => {
    if (img.closest('a[href]')) return;
    wrapInLightbox(img, img.src, img.alt, captionOf(img));
  });

  const { default: GLightbox } = await import(GLIGHTBOX_ESM);
  const lightbox = GLightbox({ selector: `.${LINK_CLASS}`, loop: true, zoomable: true });

  // Inline SVGs (e.g. mermaid diagrams) are serialized to a data URL so
  // GLightbox can load them through its standard image pipeline. Mermaid
  // renders asynchronously, so we re-run on DOM mutations as well.
  const wrapSvgs = () => {
    let added = false;
    content.querySelectorAll('svg').forEach((svg) => {
      if (svg.closest(`a.${LINK_CLASS}`)) return;
      if (svg.closest('a[href], button')) return;
      const r = svg.getBoundingClientRect();
      if (r.width < SVG_MIN_SIZE && r.height < SVG_MIN_SIZE) return;
      const xml = new XMLSerializer().serializeToString(svg);
      const href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
      wrapInLightbox(svg, href, '', captionOf(svg), 'image');
      added = true;
    });
    if (added) lightbox.reload();
  };
  wrapSvgs();
  new MutationObserver(wrapSvgs).observe(content, { childList: true, subtree: true });
}

const injectWidgetTransform = {
  name: 'lightbox-inject-widget',
  doc: 'Injects a hidden anywidget that turns figures, images, and diagrams into a lightbox gallery.',
  stage: 'document',
  plugin: (_, utils) => (tree, file) => {
    const hasContent =
      utils.selectAll('image', tree).length > 0 ||
      utils.selectAll('container[kind="figure"]', tree).length > 0 ||
      utils.selectAll('mermaid', tree).length > 0;
    if (!hasContent) return;
    // Wrap in a `block` because thebe execution seems to assume that everything
    // is a block-level item
    tree.children.push({
      type: 'block',
      children: [
        {
          type: 'anywidget',
          esm: pathMod.relative(pathMod.dirname(file.path), PLUGIN_PATH),
          model: {},
          id: crypto.randomUUID(),
        },
      ],
    });
  },
};

export default {
  name: 'Lightbox',
  transforms: [injectWidgetTransform],
  render,
};
