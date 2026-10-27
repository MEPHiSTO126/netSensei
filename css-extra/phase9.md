@@@ Nesting and Cascade Layers | TEXT
Native CSS nesting lets a rule contain related rules. Use `&` to refer to the parent selector, then write the states and children inside it:

```css
.card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;

  &:hover {
    border-color: #93b4e8;
  }

  & .card-title {
    margin-block: 0 8px;
    font-size: 1.125rem;
  }

  @media (min-width: 720px) {
    padding: 28px;
  }
}
```

The `&` is required when the nested selector needs the parent and starts with a pseudo-class or combinator. Newer browsers also allow some bare selectors inside a rule, but writing `&` keeps the relationship obvious and avoids surprises. Nesting media queries is supported, and the query still applies to the viewport, not to the component.

Nesting does not create a new specificity tier. The browser evaluates the nested selector as if it were written flat, but the selector itself still gets longer as you nest deeper. That is why `.card .card-title` is easy to override while `.page .panel .card .card-title` is not. Keep nesting to two or three levels, and nest only rules that belong to the component.

A preprocessor habit that does not transfer: `&__title` is not valid native nesting. There is no string concatenation. Write `.card-title` as a separate class, or use `& .card-title` for a descendant. Native nesting replaces the need for a compiler, not the need for a naming plan.

Nesting keeps related rules together; cascade layers decide which group wins. A layer is a named shelf in the stylesheet. Declare the shelves in priority order before the rules:

```css
@layer reset, base, layout, components, utilities;

@layer base {
  h1, h2, h3 {
    line-height: 1.2;
    text-wrap: balance;
  }
}

@layer components {
  .button {
    background: #1f5fb8;
    color: #ffffff;
  }
}

@layer utilities {
  .visually-hidden {
    position: absolute;
    clip-path: inset(50%);
  }
}
```

A later layer wins over an earlier layer regardless of selector specificity. That means a simple `.button` in `components` beats `#main .button` in `base`. This is the point: architecture decides the order, not an escalating specificity fight.

Unlayered normal declarations sit above every layer. That sounds convenient until a stray unlayered rule overrides the design system; it is why application styles should usually live in layers or all outside them, not half in and half out. `!important` reverses the layer order: for important declarations, earlier layers win and unlayered important declarations lose.

Use layers for boundaries you actually have: a reset, base element styles, layout, components, and utilities. Import third-party CSS into a vendor layer:

```css
@import url('vendor.css') layer(vendor);
```

Imports must appear before other rules, so keep them at the top of the stylesheet. Name layers in one place. A layer declared in three files with different orders becomes a bug that only appears after a build. DevTools shows the layer for each rule, which makes the winning declaration traceable. For a small personal page, layers may be overhead; for a design system with resets and third-party widgets, they are the cleanest way to keep control.

@@@ Feature Queries and Honest Fallbacks | TEXT
`@supports` asks the browser whether it can parse a declaration. It is feature detection in CSS, not browser sniffing:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@supports (grid-template-columns: subgrid) {
  .card {
    grid-column: span 3;
    display: grid;
    grid-template-columns: subgrid;
  }
}
```

The base rule works everywhere. The enhancement is applied only where subgrid exists. Write the fallback first, then enhance; the reverse order leaves unsupported browsers with nothing.

`@supports` supports `not`, `and`, and `or`. For selectors, wrap the test in `selector()`:

```css
@supports selector(:has(*)) {
  .field:has(input:user-invalid) {
    border-color: #b42318;
  }
}

@supports not (backdrop-filter: blur(8px)) {
  .sheet {
    background: #ffffff;
  }
}
```

A feature query tests syntax, not quality. A browser can parse a property and still implement it poorly, and a query cannot detect a bug. Test the actual interface on the browsers you support. Do not use `@supports` when an unsupported declaration is simply ignored and the fallback already reads correctly; use it when the layout or the whole component strategy changes.

Feature queries pair well with progressive enhancement. The baseline should remain usable without the new feature, and the enhancement should add polish or efficiency rather than rescue the page. That is the difference between a robust interface and one that collapses on an older phone.

@@@ Relational Selectors and Registered Properties | CHART
Parent state → relational selector match → dependent styles → registered custom property → animatable value

@@@ :has(), @property, and Stateful CSS | TEXT
`:has()` styles an element based on what it contains. It is a relational selector, not a parent selector in the JavaScript sense, and it works in CSS:

```css
.card:has(img) {
  padding-block-start: 0;
}

.card:has(img) .card-title {
  margin-block-start: 16px;
}

.field:has(input:user-invalid) {
  border-inline-start: 3px solid #b42318;
  padding-inline-start: 12px;
}
```

The last example styles the wrapper when the input inside it is invalid, which previously required JavaScript or a server-rendered class. Keep the relative selector specific. `:has()` takes the specificity of its most specific argument, similar to `:is()`, and it cannot be nested inside another `:has()`. Provide a fallback for browsers without support by keeping the base layout complete, then using `@supports selector(:has(*))` for the enhancement.

`@property` registers a custom property with a type, an inheritance rule, and an initial value:

```css
@property --progress {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.meter {
  --progress: 0;
  transition: --progress 400ms ease;
}

.meter.is-loaded {
  --progress: 0.72;
}

.meter::before {
  content: '';
  display: block;
  height: 4px;
  width: calc(var(--progress) * 100%);
  background: currentColor;
}
```

Without registration, a custom property is treated as a string and jumps between values instead of interpolating. With `syntax: '<number>'`, the browser validates the value and can animate it. Typed properties also give a real initial value instead of an invalid fallback. Use them for animated angles, colors, lengths, and progress values; ordinary design tokens can stay unregistered.

Both features reward a baseline-first approach. Build the static state, enhance it with relational styling, and never hide essential content behind a selector or property that a supported browser may lack.

@@@ Logical Properties and Writing Modes | TEXT
Physical properties assume the page flows left to right and top to bottom. Logical properties describe the same space in terms of the writing mode:

```css
.card {
  padding-inline: 20px;
  padding-block: 16px;
  border-inline-start: 3px solid #2563eb;
  margin-block-end: 24px;
}

.icon {
  margin-inline-end: 8px;
}

.article {
  max-inline-size: 68ch;
  margin-inline: auto;
  text-align: start;
}
```

`inline` is the direction text runs; `block` is the direction lines stack. In English, `inline` is horizontal and `block` is vertical. Change `writing-mode` to `vertical-rl` and the same rules rotate with the text. Change `direction` to `rtl` and `inline-start` moves to the right edge. `inline-size` and `block-size` replace width and height in the same way.

Use logical properties for components that may be translated, mirrored, or placed in a vertical writing mode. Use `text-align: start` rather than `left`, `margin-inline-start` rather than `margin-left`, and `inset-inline-start` rather than `left` for positioned elements. Shorthands such as `margin-inline: auto` center a block in horizontal writing, which is the common case.

Do not mix systems casually inside one component. A card with `padding-left` and `margin-inline-end` will look wrong the first time the document direction changes. Pick logical properties for layout and spacing, and keep physical properties only when the effect really is tied to the screen, such as a decorative shadow offset.

Test with `dir='rtl'` on a container and with `writing-mode: vertical-rl` on a text sample. The layout should keep its hierarchy, not merely avoid overlap. Logical properties are an internationalization feature, but they also make components more predictable when they move between contexts.

@@@ Themes, Print, and Delivery | TEXT
`color-scheme` tells the browser which color schemes the page supports. It affects form controls, scrollbars, and the canvas before your CSS loads:

```css
:root {
  color-scheme: light dark;
  --surface: light-dark(#ffffff, #0f172a);
  --ink: light-dark(#1f2937, #e5e7eb);
  --border: light-dark(#e5e7eb, #334155);
  --accent: light-dark(#1f5fb8, #8ab4f8);
}

body {
  background: var(--surface);
  color: var(--ink);
}

.card {
  border: 1px solid var(--border);
}

a {
  color: var(--accent);
}
```

`light-dark()` follows the user's preference by default. A manual toggle can set `data-theme='light'` or `data-theme='dark'` and override `color-scheme`; use it only when the user asks for a choice, and persist that choice. Do not start with a dark flash and then fix it in JavaScript; set the theme before first paint or let the system preference lead.

Web fonts are a delivery decision. Use WOFF2, declare only the weights you use, and let text render immediately:

```css
@font-face {
  font-family: 'Workshop Sans';
  src: url('/fonts/workshop-sans.woff2') format('woff2');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
```

`font-display: swap` shows the fallback first, which avoids invisible text at the cost of a visible swap. Keep the fallback stack close in size and weight, subset the font to the characters you need, and preload only the file used above the fold. A font is not worth a blank first screen.

Long text can use multiple columns, but controls and tables should not:

```css
.article-body {
  columns: 2 18rem;
  column-gap: 32px;
}

.article-body h2,
.article-body figure {
  break-inside: avoid;
}

@media print {
  nav,
  .no-print {
    display: none;
  }

  a[href]::after {
    content: ' (' attr(href) ')';
  }

  @page {
    margin: 1.5cm;
  }
}
```

Print removes backgrounds by default, so do not rely on color to carry meaning. Use `break-inside: avoid` for headings, figures, and table rows. Audit delivery with Lighthouse and by hand: contrast, keyboard focus, reduced motion, font loading, unused CSS, and a real 320px screen. A stylesheet is finished when it survives those conditions, not when it looks right on the machine that built it.
