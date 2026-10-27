@@@ Links, Lists, and Navigation | TEXT
Links are the navigation layer of the web. Style all four states, not only the resting one:

```css
a {
  color: #1f5fb8;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

a:hover {
  text-decoration-thickness: 2px;
}

a:focus-visible {
  outline: 2px solid #1f5fb8;
  outline-offset: 3px;
}
```

The default underline is not decoration; it is the signal that text is interactive. Keep it and adjust its thickness and offset instead of removing it. If the design needs a quieter link, use a darker color and a thinner line, not color alone. `:visited` may only change a small set of properties, including color, for privacy reasons. Never build meaning from visited state alone.

Navigation is a list of links inside a `nav` landmark, not a pile of divs:

```html
<nav aria-label='Primary'>
  <ul>
    <li><a href='/courses' aria-current='page'>Courses</a></li>
    <li><a href='/progress'>Progress</a></li>
  </ul>
</nav>
```

```css
nav ul {
  display: flex;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

nav a {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  color: #374151;
  text-decoration: none;
}

nav a[aria-current='page'] {
  background: #eef4ff;
  color: #173f7a;
  font-weight: 600;
}

.skip-link {
  position: absolute;
  inset-block-start: -48px;
  inset-inline-start: 16px;
  background: #ffffff;
  padding: 8px 12px;
}

.skip-link:focus {
  inset-block-start: 8px;
}
```

`list-style: none` removes bullets but should not remove semantics; in older Safari it can, so some teams add `role='list'` to the `ul`. A navigation row also needs a visible current page, not only a color change. Pair `aria-current` with weight, a background, or an underline.

Use an anchor for navigation and a button for an action. An anchor with `href='#'` and a click handler is a broken link for keyboard and assistive technology. If the element changes state on the same page, use a button.

@@@ Forms That People Can Use | TEXT
A form control is only usable if it has a persistent label. A placeholder is not a label: it disappears as soon as typing starts, often has poor contrast, and is not reliably announced. Connect the label to the control:

```html
<div class='field'>
  <label for='email'>Email address</label>
  <input id='email' name='email' type='email' autocomplete='email' aria-describedby='email-hint' required>
  <p class='hint' id='email-hint'>We send the weekly summary here.</p>
</div>
```

```css
.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-weight: 600;
}

.field input {
  font: inherit;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #ffffff;
}

.field input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.field input[aria-invalid='true'] {
  border-color: #b42318;
}
```

`font: inherit` fixes the most common form ugliness: controls that use a different font and size from the page. `accent-color: #2563eb` on checkboxes and radios gives native controls a brand color without rebuilding them. Rebuilding a checkbox with `appearance: none` means you now own focus, checked, disabled, and high-contrast behavior; do it only with all of those states designed.

Validate at the right time. An empty required field is not an error before the user has typed anything, so prefer `:user-invalid` over `:invalid` for the red border. Add a specific message and connect it:

```html
<input id='email' aria-invalid='true' aria-describedby='email-error'>
<p id='email-error'>Enter an email address, for example name@example.com.</p>
```

Group related controls in `fieldset` and `legend`, especially radio groups. Set `autocomplete` and the right `type` and `inputmode` so mobile keyboards help instead of hinder. Disabled controls cannot be focused or submitted; use `readonly` when the value still matters. Native validation is a convenience, never a substitute for validation on the server.

@@@ Tables for Data | TEXT
A table is for relationships between data, not for page layout. Use a caption, header cells, and the correct scope so a screen reader can announce which column a value belongs to:

```html
<div class='table-wrap' tabindex='0' aria-label='Recent quiz attempts'>
  <table>
    <caption>Recent quiz attempts</caption>
    <thead>
      <tr>
        <th scope='col'>Phase</th>
        <th scope='col'>Score</th>
        <th scope='col'>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope='row'>The Box Model</th>
        <td>86%</td>
        <td><time datetime='2026-10-24'>24 Oct 2026</time></td>
      </tr>
    </tbody>
  </table>
</div>
```

```css
table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}

th,
td {
  padding: 10px 12px;
  border-block-end: 1px solid #e5e7eb;
  text-align: start;
}

thead th {
  background: #f8fafc;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

tbody tr:nth-child(even) {
  background: #fbfcfe;
}

td:last-child,
th:last-child {
  text-align: end;
}
```

`border-collapse: collapse` removes double borders between cells. `tabular-nums` makes digits line up in columns, which matters when people compare scores and counts. Right-align numbers with `text-align: end`, but keep the header aligned with its data.

On a narrow screen, do not turn the table into blocks and lose the column relationships. Wrap it in a scroll container:

```css
.table-wrap {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.table-wrap:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

The wrapper needs `tabindex='0'` so keyboard users can scroll it, plus an accessible name. A sticky header helps long tables, but test it inside the scroll container rather than the page. Tables should not be the only way to present a simple two-column list; use a description list when the content is really term and definition.

@@@ Generated Content and Pseudo-elements | CHART
Element box → generated before box → generated content → element content → generated after box

@@@ Pseudo-elements, Icons, and Counters | TEXT
`::before` and `::after` create generated boxes inside an element. They exist only when `content` is set; an empty string is enough for decoration:

```css
.badge::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-inline-end: 6px;
  border-radius: 50%;
  background: #15803d;
}
```

Generated boxes are inline by default. Set `display` when they need a size or need to participate in flex layout. They are not in the DOM, so they cannot receive events or be focused. That makes them suitable for decorative marks, separators, and counters, and unsuitable for essential text or interactive controls.

Icons need the same care. Inline SVG is usually the best choice because it inherits `currentColor`, scales cleanly, and can be hidden from assistive technology when decorative:

```html
<button class='icon-button' aria-label='Close dialog'>
  <svg aria-hidden='true' viewBox='0 0 24 24' width='18' height='18'>
    <path d='M6 6l12 12M18 6L6 18' fill='none' stroke='currentColor' stroke-width='2'/>
  </svg>
</button>
```

The label is required because the icon has no text. A decorative SVG inside a link that already has text should be `aria-hidden='true'`. Do not use an icon font for meaning: if the font fails, the label can disappear, and screen readers may read a private-use character.

CSS counters number generated content without JavaScript:

```css
.steps {
  counter-reset: step;
  list-style: none;
  padding: 0;
}

.steps li {
  counter-increment: step;
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
}

.steps li::before {
  content: counter(step);
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #eef4ff;
  color: #173f7a;
  font-weight: 700;
}
```

Counters are visual. The accessible reading order still comes from the list, so keep the DOM order correct. For ordinary lists, `::marker` is simpler and supports fewer properties, mostly color, font, and content. Text shadows and decorations can add polish, but keep body text readable: a shadow belongs behind text over a photograph, not under every paragraph.

@@@ Capstone: A Settings Page | TEXT
Combine the pieces in a page a real product needs: a side navigation, a profile form, a session table, and status labels. Start with semantic HTML, then style the relationships.

```html
<div class='settings'>
  <nav aria-label='Settings'>
    <ul>
      <li><a href='#profile' aria-current='page'>Profile</a></li>
      <li><a href='#sessions'>Sessions</a></li>
    </ul>
  </nav>

  <main>
    <form class='panel'>
      <fieldset>
        <legend>Profile</legend>
        <div class='field'>
          <label for='name'>Display name</label>
          <input id='name' name='name' autocomplete='name'>
        </div>
        <div class='field'>
          <label for='email'>Email</label>
          <input id='email' name='email' type='email' autocomplete='email'>
        </div>
      </fieldset>
      <button type='submit'>Save changes</button>
    </form>

    <section class='panel'>
      <h2>Active sessions</h2>
      <div class='table-wrap' tabindex='0' aria-label='Active sessions'>
        <table>
          <thead>
            <tr><th scope='col'>Device</th><th scope='col'>Last active</th><th scope='col'>Status</th></tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>Chrome on Windows</th>
              <td>Just now</td>
              <td><span class='status'>Current</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</div>
```

```css
.settings {
  display: grid;
  gap: 24px;
}

.settings nav ul {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.panel {
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

fieldset {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  margin-block-end: 16px;
  font-size: 1.125rem;
  font-weight: 700;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #166534;
  font-size: 0.875rem;
  font-weight: 600;
}

.status::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

@media (min-width: 800px) {
  .settings {
    grid-template-columns: 200px minmax(0, 1fr);
    align-items: start;
  }

  .settings nav ul {
    flex-direction: column;
  }
}
```

Acceptance checklist: every input has a visible label; the invalid state uses text, not only red; the table keeps its headers and scrolls inside its wrapper at 320px; status has a text label beside the dot; focus is visible on links, inputs, buttons, and the table wrapper; and the page still works with the CSS-generated dot removed. Test the form with the keyboard and with a screen reader before calling it finished.

