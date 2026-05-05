---
title: Reference example with Binder
jupyter:
  kernelspec:
    display_name: Python 3
    language: python
    name: python3
---

# Reference example with Binder

This page demonstrates that the lightbox plugin coexists with executable code cells and a Binder kernel.

```{code-cell} python
from matplotlib import pyplot as plt
fig, ax = plt.subplots()
ax.scatter([1, 2, 3], [1, 3, 2])
```

The figure below remains a clickable lightbox while compute is enabled:

:::{figure} https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600
:alt: A mountain lake at dusk
:width: 80%

A mountain lake at dusk.
:::
