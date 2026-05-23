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
When a MyST element provides a caption (e.g. `{figure}`), it is shown in the lightbox modal too.

For example, click any image below.

## A figure with a caption

This uses a myst `{figure}` directive:

:::{figure} https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600
:alt: A mountain lake at dusk
:width: 80%

A mountain lake at dusk (the caption is shown in the lightbox too!).
:::

## A plain Markdown image

This uses markdown image syntax like `![]()`:

![A forest path](https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1600)

## The `{image}` role

This uses the `{image}` role:

```{image} https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600
:alt: Foggy forest
:width: 60%
```

## SVG images

SVGs will work with the lightbox, and they'll be artifically blown up in size so that they take up the screen (even if they have a hard-coded size internally).

:::{figure} ./tiny.svg
:alt: A tiny SVG with small intrinsic size
:width: 300px

A small-viewBox SVG should still expand to fill the lightbox.
:::

## A mermaid diagram

```{mermaid}
graph LR
    A[User clicks figure] --> B{Has link?}
    B -->|Yes| C[Skip - already linked]
    B -->|No| D[Wrap in lightbox anchor]
    D --> E[GLightbox opens modal]
    E --> F[Caption shown]
    E --> G[Zoom / arrow keys]
```

## How it works

The plugin loads [GLightbox](https://biati-digital.github.io/glightbox/) from a CDN at page load and wires every figure/image in the page content as a single gallery. Click → open. Arrow keys → next/prev. `+`/`-` → zoom. `Esc` → close.

```{literalinclude} ./myst.yml
:caption: docs/myst.yml
```
