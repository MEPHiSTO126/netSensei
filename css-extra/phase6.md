@@@ Normal Flow, Float, and Clear | TEXT
Normal flow is the layout you get before any positioning. Block boxes stack from top to bottom and fill the inline space; inline boxes run left to right inside line boxes and wrap at the edge. Width and height behave differently in each: a block accepts them, an inline box ignores them. Everything you build starts from this flow, so when a layout breaks, first ask which box left it.

`position: static` is the default. Offsets such as `top` and `left` do nothing until position changes. Float is the old way to pull a box to one side and let text wrap around it:

```css
.figure {
  float: right;
  width: 240px;
  margin: 0 0 16px 24px;
}
```

A floated box is removed from normal flow but still affects the line boxes beside it. Following block boxes can slide underneath it, which is why a parent can appear to collapse to zero height. `clear: both` on a later element stops it from sitting beside the float. The modern way to contain floats is `display: flow-root` on the parent, which creates a block formatting context without an extra element.

Do not build page layout with floats. Use flex or grid. Keep float for the one thing it still does well: wrapping text around an image in an article. If you inherit old code, know the clearfix:

```css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

That pattern is a historical artifact; new code should use `flow-root` or a modern layout model.

@@@ Relative and Absolute | TEXT
`position: relative` keeps the box in normal flow and shifts it visually with offsets. The space it originally occupied stays reserved, so the rest of the page does not move. More importantly, a relative box becomes the containing block for absolutely positioned descendants.

`position: absolute` removes the box from flow and positions it against the nearest positioned ancestor, or the initial containing block if none exists. Its old space collapses. That is why an absolutely positioned badge does not push the card content around.

```css
.card {
  position: relative;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

Offsets can be written individually or with `inset`. `inset: 0` stretches a box to all four edges of its containing block when width and height are auto. Centering an absolute box needs a size and auto margins:

```css
.dialog {
  position: absolute;
  inset: 0;
  width: min(420px, calc(100% - 32px));
  height: max-content;
  margin: auto;
}
```

Absolute positioning is for overlays, badges, decorative shapes, and menus. It is not a page layout system. Each absolute box leaves the flow, so a container full of absolute children has no height unless you set one. Keep the DOM order meaningful because visual position no longer follows reading order.

@@@ Fixed, Sticky, and Scroll-Aware UI | TEXT
`position: fixed` anchors a box to the viewport. It leaves flow, stays put while the page scrolls, and is used for persistent headers, floating action buttons, and toasts. Offsets are relative to the viewport, not the document.

`position: sticky` is a hybrid. The box stays in flow until it crosses a threshold, then sticks inside its scrolling ancestor. It needs an offset such as `top: 0`, and it stops sticking when its parent scrolls away.

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffff;
}

.to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
}
```

Sticky fails silently when an ancestor has `overflow: hidden`, `overflow: auto`, a transform, or a filter. The scroll container may also be the wrong one. Test by scrolling the actual page, not just resizing the window.

Prefer sticky headers over fixed ones because sticky reserves its space and does not cover the first section. If you use anchor links under a sticky header, add scroll padding:

```css
html {
  scroll-padding-top: 72px;
}
```

Smooth scrolling is a motion feature; gate it behind `prefers-reduced-motion`.

@@@ Stacking Order and z-index | CHART
Stacking context root → Negative z-index → In-flow blocks → Floats → Inline content → Positioned z-index auto → Positive z-index

@@@ Overlays: Dropdowns, Modals, and Tooltips | TEXT
A dropdown is a positioned menu inside a relatively positioned wrapper. The wrapper anchors the menu; the menu is absolute, sits below the trigger, and gets a z-index token.

```css
.menu-wrap {
  position: relative;
}

.menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 200px;
  z-index: var(--z-menu);
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgb(15 23 42 / 0.12);
}
```

Open it with a class or `:focus-within`; if you use `:focus-within`, keyboard users can reach the menu, but you still need Escape handling and `aria-expanded` in JavaScript.

A modal should use the native `<dialog>` element. It handles focus trapping, Escape, and the backdrop. Style it and its backdrop:

```css
dialog {
  border: 0;
  border-radius: 12px;
  padding: 24px;
  max-width: 480px;
}

dialog::backdrop {
  background: rgb(15 23 42 / 0.55);
  backdrop-filter: blur(2px);
}
```

A tooltip is a small absolute box near its trigger, shown on hover and focus. Keep it inside the viewport, do not put essential instructions only in a tooltip, and connect it with `aria-describedby`. On touch, hover does not exist; provide a visible label or a tap target.

Use a small set of z-index tokens such as `--z-dropdown`, `--z-modal`, and `--z-toast` instead of 9999. Random large numbers turn into an arms race the first time a third-party widget appears.

@@@ Capstone: Sticky Header with Menu and Badge | TEXT
Build a header that survives a real page: logo, navigation, notification bell with a count, and a menu that opens on focus.

```css
:root {
  --z-header: 10;
  --z-menu: 20;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  background: rgb(255 255 255 / 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e5e7eb;
}

.bell {
  position: relative;
}

.bell .count {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: #b42318;
  color: #ffffff;
  font-size: 0.75rem;
  line-height: 18px;
  text-align: center;
}

.menu-wrap {
  position: relative;
}

.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: var(--z-menu);
  min-width: 220px;
}
```

Acceptance checklist: the header does not cover anchor targets thanks to `scroll-padding-top`; the menu is reachable by Tab and closes on Escape; the badge stays inside the bell at 320px; focus is visible on every control; the layout still works with reduced motion and without `backdrop-filter`.

Do not add a hamburger menu until the links actually stop fitting. A row of four links does not need JavaScript.
