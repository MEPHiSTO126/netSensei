@@@ Transitions: From State to State | TEXT
A transition animates a property between two values. It needs a start state, an end state, and a rule that connects them. The browser interpolates the value over time; without a second state, nothing moves.

```css
.button {
  background: #1f6ae1;
  color: #ffffff;
  transition: background-color 160ms ease, transform 160ms ease;
}

.button:hover {
  background: #1858bd;
  transform: translateY(-1px);
}
```

Put the transition on the base rule, not only on `:hover`. A transition declared only in the hover state runs on the way in but snaps on the way out. The base rule makes both directions animate.

Name the properties instead of writing `transition: all`. `all` animates surprises, including properties you did not intend to change, and it hides which parts of the design are in motion. Common choices are `color`, `background-color`, `border-color`, `opacity`, `transform`, and `box-shadow`.

`display` does not transition, and `height: auto` still cannot interpolate in most browsers. For an element that appears, combine `@starting-style` with `transition-behavior: allow-discrete`, or animate `opacity` and `transform` while toggling `visibility`.

Easing shapes the speed. `ease-out` starts fast and settles, which suits elements entering; `ease-in` starts slow and accelerates, which suits elements leaving. Keep UI transitions around 120 to 240 milliseconds. Longer feels sluggish; shorter is easy to miss.

@@@ Transforms: Move, Rotate, Scale | TEXT
`transform` changes how a box is painted without changing the layout around it. A translated card does not push its siblings; a scaled image does not resize its grid track. That is why transforms are cheap enough to animate.

```css
.card {
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 24px rgb(15 23 42 / 0.12);
}

.icon-open {
  transform: rotate(45deg);
}
```

Functions compose in order. `translate(20px) rotate(10deg)` moves the rotated coordinate system; `rotate(10deg) translate(20px)` moves along the rotated axis. When the result surprises you, read the list left to right and test each function alone.

Modern CSS also exposes individual `translate`, `rotate`, and `scale` properties. They are easier to override because changing one does not replace the others:

```css
.card:hover {
  translate: 0 -4px;
  scale: 1.01;
}
```

`transform-origin` sets the hinge. The default is the center; a menu that grows from its trigger might use `transform-origin: top right`. For depth, add `perspective` to the parent and rotate a child on the Y axis. Keep 3D effects subtle and never make essential content depend on them.

Transforms can create a stacking context. A transformed ancestor also becomes the containing block for fixed descendants, which is a common reason a fixed header suddenly scrolls with its parent.

@@@ Keyframe Animations | TEXT
A transition needs a state change. A keyframe animation runs on its own timeline, with as many stops as you need.

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

.status-dot {
  animation: pulse 2s ease-in-out infinite;
}
```

The shorthand order is name, duration, easing, delay, iteration count, direction, fill mode, and play state. Only the name and duration are required. `animation-fill-mode: both` keeps the first and last frames applied before and after the run; `animation-play-state: paused` lets a hover or class pause the loop.

A skeleton shimmer uses the same tool with a moving gradient:

```css
@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #eef2f7 25%, #f8fafc 50%, #eef2f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}
```

Animate `transform` and `opacity` when you can. Animating `width`, `height`, `top`, or `left` forces layout on every frame and drops frames on low-end phones. One focal animation per view is enough; a page where everything pulses reads as noise.

@@@ Motion Budget and Reduced Motion | CHART
State change → Transition → Transform and opacity → Composite → Reduced-motion fallback

@@@ Opacity, Filters, and Depth | TEXT
`opacity` fades the whole element, including its text, borders, and children. An alpha color fades one paint layer and leaves the rest opaque. Use alpha when a background should show through, and `opacity` when the entire component should recede.

```css
.overlay {
  background: rgb(15 23 42 / 0.55);
}

.hero-media {
  filter: saturate(0.9) contrast(1.05);
}

.sheet {
  background: rgb(255 255 255 / 0.8);
  backdrop-filter: blur(12px);
}
```

`filter` applies effects such as `blur`, `brightness`, `contrast`, `grayscale`, and `drop-shadow` to the element and its children. `backdrop-filter` blurs whatever is behind the element, which is how frosted panels work. Both can be expensive on large areas; test on a mid-range phone, not only on your desktop.

`mix-blend-mode` blends an element with its backdrop. `isolation: isolate` on a parent keeps that blending inside the component instead of leaking into the page. Shadows should be layered and low contrast; a single huge blur radius looks like a smudge.

For media, use `object-fit` and `object-position` to fill a frame without distortion, `aspect-ratio` to reserve the shape, and `clip-path` for simple shapes. `mask-image` can fade an edge, but provide a readable fallback. Always check text contrast over images and translucent surfaces; a filter can undo a carefully chosen color pair.

@@@ Gradients, Background Layers, and Texture | TEXT
A gradient is an image, not a color. It belongs in `background-image`, and it can sit in a stack with a photo or a texture.

```css
.hero {
  background:
    linear-gradient(180deg, rgb(15 23 42 / 0.78), rgb(15 23 42 / 0.3)),
    url('/hero.jpg') center / cover no-repeat;
  color: #ffffff;
}

.badge {
  background: conic-gradient(from 180deg, #2563eb, #1f6ae1, #2563eb);
}
```

`linear-gradient` runs along a line, `radial-gradient` expands from a point, and `conic-gradient` sweeps around a center. The first color stops are the most useful: two close neutrals create depth without becoming decoration.

Background layers are painted from last to first, so the gradient listed first sits on top of the image. `background-size: cover` fills the box and may crop; `contain` shows the whole image and may leave gaps. `background-position` chooses the crop. `background-repeat` controls tiling.

```css
.pattern {
  background-image: repeating-linear-gradient(
    45deg,
    #f8fafc 0 8px,
    #eef2f7 8px 16px
  );
}
```

Use gradients to support the interface: a subtle surface shift, a scrim behind hero text, a progress ring. Avoid rainbow gradients and purple-blue hero washes; they date quickly and fight the content. If you use gradient text with `background-clip: text`, provide a solid color fallback and check contrast in both themes.

`background-attachment: fixed` is janky on mobile and often disabled. A fixed-position pseudo-element gives the same parallax look with more control, but parallax is optional decoration, never required for reading.
