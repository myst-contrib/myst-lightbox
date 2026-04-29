# myst-lightbox

A MyST plugin that automatically turns every figure and image on a page into a clickable lightbox, with caption, zoom, and gallery navigation. Powered by [GLightbox](https://biati-digital.github.io/glightbox/).

## Usage

Add the plugin to your `myst.yml`:

```yaml
project:
  plugins:
    - https://raw.githubusercontent.com/choldgraf/myst-lightbox/main/src/index.mjs
```

That's it. Build your site as usual.

## Local development

```bash
nox -s docs-live   # serve the demo at http://localhost:3000
nox -s docs        # build the demo site
```
