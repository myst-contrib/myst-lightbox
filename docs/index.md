---
title: myst-lightbox
---

# Lightbox Plugin

A MyST plugin that automatically turns every figure and image on a page into a clickable lightbox, with caption, zoom, and gallery navigation.

**Usage**: Simply enable it in your `myst.yml` plugins list:

```yaml
project:
  plugins:
    - https://raw.githubusercontent.com/choldgraf/myst-lightbox/main/src/index.mjs
```

It will automatically identify each image and figure in your content and make it lightboxed, if no link exists.

For example, click any image below.

## A figure with a caption

:::{figure} https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600
:alt: A mountain lake at dusk
:width: 80%

A mountain lake at dusk — the caption is shown in the lightbox too.
:::

## A plain Markdown image

![A forest path](https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1600)

## The `{image}` role

```{image} https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600
:alt: Foggy forest
:width: 60%
```

## How it works

The plugin loads [GLightbox](https://biati-digital.github.io/glightbox/) from a CDN at page load and wires every figure/image in the page content as a single gallery. Click → open. Arrow keys → next/prev. `+`/`-` → zoom. `Esc` → close.

```{literalinclude} ./myst.yml
:caption: docs/myst.yml
```
