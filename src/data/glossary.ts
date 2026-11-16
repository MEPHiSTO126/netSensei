import type { GlossaryEntry } from "@/lib/glossary";

/**
 * Terms a learner meets before the course explains them.
 *
 * Every entry was found by scanning the 245 stages for a term that is used
 * before it is defined: the first stage that mentions it is the stage it
 * belongs to, and that is the only stage where it is highlighted. Later
 * stages leave it alone, so the page does not fill up with marks.
 *
 * `scripts/dev/verify_glossary.mts` checks that every entry still points at a
 * real stage that still contains the term, so renaming a stage breaks the
 * check instead of quietly dropping the explanation.
 */
export const GLOSSARY: GlossaryEntry[] = [
  /* ── CSS: flexbox sizing ─────────────────────────────────────── */
  {
    term: "flex-grow",
    module: "CSS: The Styling Layer",
    stage: "Growing, Shrinking, and Wrapping",
    explanation:
      "How much of the leftover space a flex item is allowed to claim. Give every item the same number and the extra space is split evenly; give one item a bigger number and it takes more of it.",
  },
  {
    term: "flex-shrink",
    module: "CSS: The Styling Layer",
    stage: "Growing, Shrinking, and Wrapping",
    explanation:
      "How much an item gives back when there is not enough room. The default is 1, so everything shrinks a little; set it to 0 on an item that must keep its size.",
  },
  {
    term: "flex-basis",
    module: "CSS: The Styling Layer",
    stage: "Growing, Shrinking, and Wrapping",
    explanation:
      "The size an item starts at, before any leftover space is shared out. Think of it as the item's starting weight on the scale.",
  },

  /* ── CSS: alignment ──────────────────────────────────────────── */
  {
    term: "flex-start",
    module: "CSS: The Styling Layer",
    stage: "Alignment Without Margins",
    explanation:
      "Line the items up against the start of the row — the left in English, the right in a right-to-left language.",
  },
  {
    term: "flex-end",
    module: "CSS: The Styling Layer",
    stage: "Alignment Without Margins",
    explanation:
      "Line the items up against the end of the row — the right in English, the left in a right-to-left language.",
  },
  {
    term: "space-between",
    module: "CSS: The Styling Layer",
    stage: "Alignment Without Margins",
    explanation:
      "Put the first item at the start and the last item at the end, then spread the gap evenly between everything in between. Nothing is left over at the edges.",
  },
  {
    term: "space-around",
    module: "CSS: The Styling Layer",
    stage: "Alignment Without Margins",
    explanation:
      "Give every item the same amount of space around it, so the items at the two edges end up with half the gap of the ones in the middle.",
  },
  {
    term: "space-evenly",
    module: "CSS: The Styling Layer",
    stage: "Alignment Without Margins",
    explanation:
      "Give every item the same amount of space, including the two ends. Every gap on the line is exactly the same size.",
  },

  /* ── CSS: media queries ──────────────────────────────────────── */
  {
    term: "prefers-color-scheme",
    module: "CSS: The Styling Layer",
    stage: "Media Queries and Container Queries",
    explanation:
      "Reports whether the reader's operating system is set to light or dark, so the page can offer a dark theme without being told to. It is a suggestion, not a command.",
  },
  {
    term: "prefers-reduced-motion",
    module: "CSS: The Styling Layer",
    stage: "Media Queries and Container Queries",
    explanation:
      "Reports whether the reader has asked their operating system for less movement, because animation can make some people ill. When it is on, swap moving parts for plain changes.",
  },

  /* ── CSS: overlays and accessibility ──────────────────────────── */
  {
    term: "aria-expanded",
    module: "CSS: The Styling Layer",
    stage: "Overlays: Dropdowns, Modals, and Tooltips",
    explanation:
      "Tells assistive technology whether a control is currently open. Set it to true while the menu is showing and false while it is closed, so a screen reader user knows there is something new below the button.",
  },
  {
    term: "aria-describedby",
    module: "CSS: The Styling Layer",
    stage: "Overlays: Dropdowns, Modals, and Tooltips",
    explanation:
      "Points at the id of the element holding the extra description. It is how a tooltip, a hint or an error message gets attached to the thing it belongs to.",
  },

  /* ── CSS: depth and effects ──────────────────────────────────── */
  {
    term: "mix-blend-mode",
    module: "CSS: The Styling Layer",
    stage: "Opacity, Filters, and Depth",
    explanation:
      "Tells the browser how an element's colours should mix with the ones behind it, the way ink blends on wet paper. `multiply` darkens, `screen` lightens.",
  },
  {
    term: "object-fit",
    module: "CSS: The Styling Layer",
    stage: "Overflow, Intrinsic Size, and Aspect Ratio",
    explanation:
      "Decides what an image does when its box is a different shape from the image itself. `cover` fills the box and crops the overflow; `contain` shows the whole image and leaves empty space.",
  },
  {
    term: "object-position",
    module: "CSS: The Styling Layer",
    stage: "Opacity, Filters, and Depth",
    explanation:
      "Where the image sits inside its box when the image is bigger than the box. `center` keeps the middle, `top` keeps the top.",
  },
  {
    term: "clip-path",
    module: "CSS: The Styling Layer",
    stage: "Opacity, Filters, and Depth",
    explanation:
      "Cuts a shape out of an element, so the parts outside the shape are not drawn at all. You can clip to a circle, to a polygon, or to any outline you can describe.",
  },
  {
    term: "mask-image",
    module: "CSS: The Styling Layer",
    stage: "Opacity, Filters, and Depth",
    explanation:
      "Uses an image as a stencil: the dark parts of the image let the element show and the bright parts hide it. It is how you fade an element out with a gradient.",
  },
  {
    term: "background-position",
    module: "CSS: The Styling Layer",
    stage: "Gradients, Background Layers, and Texture",
    explanation:
      "Where the background image sits inside the element, like saying where to place a photo on a sheet of paper. `center` is the default.",
  },

  /* ── CSS: writing modes and logical properties ───────────────── */
  {
    term: "writing-mode",
    module: "CSS: The Styling Layer",
    stage: "Logical Properties and Writing Modes",
    explanation:
      "Sets which direction the text runs in. `horizontal-tb` is ordinary English; `vertical-rl` runs the text downwards with the columns stacked from the right.",
  },
  {
    term: "vertical-rl",
    module: "CSS: The Styling Layer",
    stage: "Logical Properties and Writing Modes",
    explanation:
      "The writing mode where text runs from top to bottom and the columns stack from right to left. It is how vertical Japanese and Chinese text is usually written.",
  },
  {
    term: "block-size",
    module: "CSS: The Styling Layer",
    stage: "Logical Properties and Writing Modes",
    explanation:
      "The height of a box in writing-mode terms: the size along the block direction. In ordinary left-to-right text it is just the height, but in vertical text it flips to the width.",
  },
  {
    term: "margin-inline-start",
    module: "CSS: The Styling Layer",
    stage: "Alignment Without Margins",
    explanation:
      "The margin on the reading-start side of the box — the left in English, the right in a right-to-left language. Using it means the layout still reads correctly when the language changes.",
  },
  {
    term: "inset-inline-start",
    module: "CSS: The Styling Layer",
    stage: "Logical Properties and Writing Modes",
    explanation:
      "The same idea as `margin-inline-start`, but for `position`: instead of a margin it sets where the element is pinned — the left in English, the right in a right-to-left language.",
  },

  /* ── CSS: themes ─────────────────────────────────────────────── */
  {
    term: "light-dark",
    module: "CSS: The Styling Layer",
    stage: "Themes, Print, and Delivery",
    explanation:
      "A CSS function that picks one of two colours depending on whether the page is in light or dark mode, so one declaration covers both themes.",
  },

  /* ── CSS: box model shorthand ───────────────────────────────── */
  {
    term: "shorthand",
    module: "CSS: The Styling Layer",
    stage: "Four Boxes, One Element",
    explanation:
      "Writing several related properties in one line, like `margin: 10px 20px` instead of four separate margin rules.",
  },

  /* ── Orientation: the browser ────────────────────────────────── */
  {
    term: "viewport",
    module: "Orientation: The Workshop",
    stage: "The Browser and URL Bar",
    explanation:
      "The size of the window the page is being shown in. It changes with the screen, with the window and with the zoom level, which is why the same page looks different on a phone and on a monitor.",
  },
  {
    term: "cascade",
    module: "Orientation: The Workshop",
    stage: "DevTools Elements and Console",
    explanation:
      "When two rules try to style the same thing, the browser decides which one wins by going through the rules in order, letting the later and more specific ones have the final say.",
  },

  /* ── Inside the browser ──────────────────────────────────────── */
  {
    term: "specificity",
    module: "Inside the Browser",
    stage: "CSSOM",
    explanation:
      "The score the browser gives each selector to decide which rule wins when two of them target the same element. The score comes from how many ids, classes and element names the selector uses.",
  },
  {
    term: "async",
    module: "Inside the Browser",
    stage: "Render-Blocking Resources",
    explanation:
      "On a `<script>` tag, it lets the file download in the background and run as soon as it arrives, without holding up the rest of the page. In JavaScript, `async` marks a function that waits for promises instead of blocking.",
  },
  {
    term: "reflow",
    module: "Inside the Browser",
    stage: "Layout and Reflow",
    explanation:
      "Working out again where every box on the page should go and how big it should be, after something changed the sizes. It is the expensive part of updating a page.",
  },
  {
    term: "repaint",
    module: "Inside the Browser",
    stage: "Paint and Composite",
    explanation:
      "Redrawing the pixels of a part of the page because something about its appearance changed — a colour, say — while its size and position stayed the same.",
  },

  /* ── What happens when you hit enter ─────────────────────────── */
  {
    term: "payload",
    module: "What Happens When You Hit Enter",
    stage: "Fetch and Response",
    explanation:
      "The actual data being carried: the part of a response that is the page or the file, not the envelope around it.",
  },
  {
    term: "bandwidth",
    module: "What Happens When You Hit Enter",
    stage: "Status Codes and Timings",
    explanation:
      "How much data the connection can carry at once. On a slow connection big files take a long time to arrive, however fast the server is.",
  },
  {
    term: "handshake",
    module: "What Happens When You Hit Enter",
    stage: "TCP and TLS",
    explanation:
      "The short conversation at the start of a connection where the two sides agree how to talk to each other before any real data is sent.",
  },
  {
    term: "CORS",
    module: "What Happens When You Hit Enter",
    stage: "Request and Response Headers",
    explanation:
      "The browser rule that stops one website quietly reading data from another. A server has to allow it explicitly by sending an `Access-Control-Allow-Origin` header.",
  },

  /* ── JavaScript Survival Kit ─────────────────────────────────── */
  {
    term: "parseInt",
    module: "JavaScript Survival Kit",
    stage: "Type Conversion",
    explanation:
      "Turns a piece of text into a whole number. `parseInt(\"42\")` gives 42, but `parseInt(\"42px\")` also gives 42, which is why `Number()` is often the safer choice.",
  },
  {
    term: "prototype",
    module: "JavaScript Survival Kit",
    stage: "Function Declarations and Arrows",
    explanation:
      "The shared list of methods that every object of a kind inherits. `myArray.push` really lives on the array's prototype, which is why every array can use it.",
  },
  {
    term: "coercion",
    module: "JavaScript Survival Kit",
    stage: "Type Conversion",
    explanation:
      "JavaScript quietly changing a value's type to fit the situation. `1 + \"2\"` gives `\"12\"` because the number was turned into text.",
  },
  {
    term: "hoisting",
    module: "JavaScript Survival Kit",
    stage: "let and const vs var",
    explanation:
      "JavaScript moving declarations to the top of their scope before any code runs. That is why a function declared further down the file can still be called earlier.",
  },
  {
    term: "destructuring",
    module: "JavaScript Survival Kit",
    stage: "Object.keys, values, entries",
    explanation:
      "Pulling values out of an object or array into separate variables in one go, like `const { name } = user` instead of `const name = user.name`.",
  },
  {
    term: "spread",
    module: "JavaScript Survival Kit",
    stage: "Objects and Dot Access",
    explanation:
      "The `...` in `{ ...user }`. It copies the properties of one object into another, or the items of one array into another.",
  },
  {
    term: "nullish",
    module: "JavaScript Survival Kit",
    stage: "Objects and Dot Access",
    explanation:
      "Short for 'null or undefined'. The `??` operator supplies a fallback only when the value is one of those two, so a real `0` or an empty string is kept as it is.",
  },
  {
    term: "immutable",
    module: "JavaScript Survival Kit",
    stage: "Primitives",
    explanation:
      "A value that cannot be changed after it is made. Numbers, strings and booleans are all immutable, which is why `let x = 1; x = 2` makes a new value rather than editing the old one.",
  },
  {
    term: "BigInt",
    module: "JavaScript Survival Kit",
    stage: "Primitives",
    explanation:
      "A whole-number type that can hold values far bigger than a normal number, such as a thirty-digit id. You write it with an `n` on the end, like `9007199254740993n`.",
  },

  /* ── The DOM is an API ───────────────────────────────────────── */
  {
    term: "getElementsByClassName",
    module: "The DOM Is an API",
    stage: "getElementById Contrast",
    explanation:
      "Finds every element with a given class name and returns them as a live list, so it keeps up as the page changes. It matches one class at a time, so an element with two classes needs `classList.contains`.",
  },
  {
    term: "getElementsByTagName",
    module: "The DOM Is an API",
    stage: "getElementById Contrast",
    explanation:
      "Finds every element with a given tag name, like `p` or `li`, and returns them as a live list.",
  },
  {
    term: "classList",
    module: "The DOM Is an API",
    stage: "classList and dataset",
    explanation:
      "A built-in list of the classes on an element, with methods to change them: `add`, `remove`, `toggle` and `contains`. It keeps the class attribute tidy so you never edit the string by hand.",
  },
  {
    term: "replaceWith",
    module: "The DOM Is an API",
    stage: "Removing and Replacing",
    explanation:
      "Swaps one element for another in the page, in place. The old element is removed and the new one takes its position.",
  },
  {
    term: "replaceChildren",
    module: "The DOM Is an API",
    stage: "Removing and Replacing",
    explanation:
      "Clears a parent element and puts new content inside it in one call. Handy for redrawing a list without emptying the page first.",
  },
  {
    term: "parentElement",
    module: "The DOM Is an API",
    stage: "Traversal",
    explanation:
      "The element that contains this one. `button.parentElement` is the box the button sits in.",
  },
  {
    term: "firstElementChild",
    module: "The DOM Is an API",
    stage: "Traversal",
    explanation:
      "The first child element of a parent — the first thing inside it that is an element rather than a stray piece of text.",
  },
  {
    term: "nextElementSibling",
    module: "The DOM Is an API",
    stage: "Traversal",
    explanation:
      "The element right after this one, sharing the same parent.",
  },
  {
    term: "previousElementSibling",
    module: "The DOM Is an API",
    stage: "Traversal",
    explanation:
      "The element right before this one, sharing the same parent.",
  },
  {
    term: "nextSibling",
    module: "The DOM Is an API",
    stage: "Traversal",
    explanation:
      "The next thing after this one inside the same parent — which might be a piece of text rather than an element.",
  },
  {
    term: "DocumentFragment",
    module: "The DOM Is an API",
    stage: "Building a List Safely",
    explanation:
      "A temporary, invisible container you can fill with elements and then drop into the page in one go. The browser only draws the list once, so it is much faster than adding items one at a time.",
  },
  {
    term: "addEventListener",
    module: "The DOM Is an API",
    stage: "XSS and innerHTML",
    explanation:
      "Attaches a function to an event, so it runs when that event happens — a click, a keystroke, a scroll. It is the modern way to react to anything the reader does.",
  },

  /* ── JavaScript Core ─────────────────────────────────────────── */
  {
    term: "replaceAll",
    module: "JavaScript Core",
    stage: "String Methods",
    explanation:
      "Replaces every occurrence of a piece of text, not just the first one. `replace` stops after one; `replaceAll` goes through the whole string.",
  },
  {
    term: "localeCompare",
    module: "JavaScript Core",
    stage: "Sort, Slice, and Splice",
    explanation:
      "Compares two strings the way the reader's language would, so accented and differently cased letters sort correctly. It returns a negative number, zero or a positive number, just like sorting numbers.",
  },
  {
    term: "dateStyle",
    module: "JavaScript Core",
    stage: "Intl Dates",
    explanation:
      "A shortcut for asking for a date in a named style: `dateStyle: \"long\"` gives '16 November 2026', `\"short\"` gives '16/11/26'.",
  },
  {
    term: "timeStyle",
    module: "JavaScript Core",
    stage: "Intl Dates",
    explanation:
      "The same idea for the time of day: `timeStyle: \"short\"` gives '09:41', and `\"medium\"` adds the seconds.",
  },
  {
    term: "timeZone",
    module: "JavaScript Core",
    stage: "Intl Dates",
    explanation:
      "Which city or region's clock to use when formatting a date. `timeZone: \"Africa/Lagos\"` shows the time in Lagos whatever the reader's own clock says.",
  },
  {
    term: "WeakMap",
    module: "JavaScript Core",
    stage: "WeakMap and WeakSet",
    explanation:
      "A set of key-value pairs where the key is an object, and the entry disappears on its own once nothing else refers to that object. It cannot be listed, which is exactly what makes it safe from holding on to memory.",
  },
  {
    term: "WeakSet",
    module: "JavaScript Core",
    stage: "WeakMap and WeakSet",
    explanation:
      "A list of objects where each one is removed automatically once nothing else refers to it. It is a quick way to ask 'have I already seen this object?'",
  },
  {
    term: "hasOwnProperty",
    module: "JavaScript Core",
    stage: "Prototypes",
    explanation:
      "Checks whether an object itself has a particular property, as opposed to inheriting it. `obj.hasOwnProperty(\"name\")` is true only for properties set directly on that object.",
  },
  {
    term: "structuredClone",
    module: "JavaScript Core",
    stage: "Shallow vs Deep Copies",
    explanation:
      "Makes a deep copy of a value, so the nested objects and arrays inside it are copied too. It cannot copy functions, but it does handle an object that contains itself.",
  },
  {
    term: "localStorage",
    module: "JavaScript Core",
    stage: "localStorage and sessionStorage",
    explanation:
      "Storage that stays in the browser after you close the tab, and is shared by every page on the same site. It holds only text, and every read is slow enough that you should not do it in a loop.",
  },
  {
    term: "sessionStorage",
    module: "JavaScript Core",
    stage: "localStorage and sessionStorage",
    explanation:
      "Storage that lasts only for the tab you are using. Close the tab and it is gone, which makes it a good place for a basket that should not survive a restart.",
  },
  {
    term: "iterator",
    module: "JavaScript Core",
    stage: "Regular Expressions",
    explanation:
      "Something you can step through one value at a time. `for...of` uses one, and `matchAll` hands one back so you can walk every match in turn.",
  },
  {
    term: "regex",
    module: "JavaScript Core",
    stage: "String Methods",
    explanation:
      "A pattern written as text that describes the strings to find — `\\d+` matches any run of digits. Regular expression is short for it.",
  },
  {
    term: "promise",
    module: "JavaScript Core",
    stage: "try/catch Patterns",
    explanation:
      "An object that stands for a result you do not have yet. It ends up either fulfilled with a value or rejected with a reason, and you wait for it with `await`.",
  },
  {
    term: "refactor",
    module: "JavaScript Core",
    stage: "Modules",
    explanation:
      "Rewriting working code so it is cleaner without changing what it does. The point is to make the next change easier.",
  },

  /* ── Async and the event loop ────────────────────────────────── */
  {
    term: "event loop",
    module: "Async and the Event Loop",
    stage: "Task and Microtask Queues",
    explanation:
      "The browser's scheduler. When the current piece of code finishes, it picks the next job to run, and keeps going around the loop until there is nothing left to do.",
  },
  {
    term: "microtask",
    module: "Async and the Event Loop",
    stage: "Task and Microtask Queues",
    explanation:
      "A small job that jumps the queue. Promise callbacks run as microtasks, so they all finish before the browser moves on to the next task, such as a timer.",
  },
  {
    term: "latency",
    module: "Async and the Event Loop",
    stage: "Blocking the Main Thread",
    explanation:
      "The delay between doing something and seeing the result. On a web page it is the time between a click and the page responding.",
  },

  /* ── State ───────────────────────────────────────────────────── */
  {
    term: "setter",
    module: "State",
    stage: "What State Is",
    explanation:
      "The function that changes a value. `useState` gives you the current value and a setter; calling the setter with a new value updates it.",
  },
  {
    term: "mutable",
    module: "State",
    stage: "Immutable Updates",
    explanation:
      "A value that can be changed after it is made, like an object or an array. `useRef` gives you one, so you can keep a value without causing a re-render.",
  },
  {
    term: "memo",
    module: "State",
    stage: "Derived State",
    explanation:
      "Remembering the result of an expensive calculation so you do not do it again. React's `memo` does the same for a component: it skips re-rendering when the props have not changed.",
    aliases: ["memoization", "memoized"],
  },

  /* ── React Basics ────────────────────────────────────────────── */
  {
    term: "onChange",
    module: "React Basics",
    stage: "Controlled Forms",
    explanation:
      "A React prop that hands you a function to call whenever the reader types or picks something. You use it to copy what they typed into state, so the form is driven by your code.",
  },
  {
    term: "defaultValue",
    module: "React Basics",
    stage: "Textarea, File, and Uncontrolled",
    explanation:
      "The starting value of an input that the browser owns. The reader can change it and the page does not have to keep track; it is the uncontrolled version of `value`.",
  },
  {
    term: "defaultChecked",
    module: "React Basics",
    stage: "Textarea, File, and Uncontrolled",
    explanation:
      "The starting checked state of a checkbox or radio button that the browser owns — the uncontrolled version of `checked`.",
  },
  {
    term: "minLength",
    module: "React Basics",
    stage: "Validation and Errors",
    explanation:
      "An HTML attribute that says how short a text field may be. The browser refuses to submit a shorter value and shows its own message.",
  },
  {
    term: "aria-invalid",
    module: "React Basics",
    stage: "Validation and Errors",
    explanation:
      "Marks a field as not valid, so a screen reader can announce the problem. Set it to true after checking the value, and point `aria-describedby` at the message that explains what went wrong.",
  },
  {
    term: "htmlFor",
    module: "React Basics",
    stage: "Vite and JSX",
    explanation:
      "The React version of the `for` attribute on a label. It holds the id of the input the label belongs to, so clicking the text focuses the right box.",
  },
  {
    term: "useId",
    module: "React Basics",
    stage: "Accessible Form Markup",
    explanation:
      "A React hook that hands back a unique id, generated once for each component instance. Use it to link a label to its input, or a tooltip to its trigger, without inventing ids by hand.",
  },
  {
    term: "aria-live",
    module: "React Basics",
    stage: "Accessible Form Markup",
    explanation:
      "Marks a region whose contents change on their own, so a screen reader announces the change. Use `polite` for a status message and `assertive` for an error that has to interrupt.",
  },
  {
    term: "useSearchParams",
    module: "React Basics",
    stage: "Params and Query Strings",
    explanation:
      "A React Router hook that gives you the query string of the current page as a URLSearchParams object. `searchParams.get(\"page\")` reads one value out of it.",
  },
  {
    term: "getDerivedStateFromError",
    module: "React Basics",
    stage: "Error Boundaries",
    explanation:
      "A static method on an error boundary that runs after a child crashes. It returns the state that should replace the broken screen, usually `{ hasError: true }`.",
  },
  {
    term: "componentDidCatch",
    module: "React Basics",
    stage: "Error Boundaries",
    explanation:
      "A class method on an error boundary that runs after a child crashes. It receives the error and the stack, which is where you log the problem so you can fix it.",
  },
  {
    term: "useTransition",
    module: "React Basics",
    stage: "Lazy Loading and Suspense",
    explanation:
      "A React hook that marks an update as non-urgent. The page keeps responding while the slower part finishes, so typing in a search box stays smooth.",
  },
  {
    term: "startTransition",
    module: "React Basics",
    stage: "Lazy Loading and Suspense",
    explanation:
      "The function that goes with `useTransition`. Wrap a state update in it and React tells the browser the new content is not urgent, so the current screen stays on screen.",
  },
  {
    term: "createPortal",
    module: "React Basics",
    stage: "Portals and Dialogs",
    explanation:
      "Renders a piece of your interface somewhere else on the page — usually at the very end of the body — while keeping it logically part of the component that made it. A modal dialog uses this so it can sit on top of everything, no matter where in the tree it was written.",
  },
  {
    term: "SPA",
    module: "React Basics",
    stage: "React Router Basics",
    explanation:
      "A single-page application: a site that loads one HTML page and then swaps the content inside it, instead of loading a fresh page for every screen.",
  },

  /* ── Domain words a learner meets cold in ordinary prose ────────
     These are not code identifiers. They are the vocabulary of the
     workshop, the network, the browser, the DOM and React, used in a
     sentence before the course gets around to defining them. */

  {
    term: "localhost",
    module: "Orientation: The Workshop",
    stage: "The Browser and URL Bar",
    explanation:
      "Your own computer, written as an address. localhost:3000 means 'the server running on my machine at port 3000' — nothing travels over the internet.",
  },
  {
    term: "MIME",
    module: "Orientation: The Workshop",
    stage: "Serve and Open",
    explanation:
      "A short label that says what a file really is, like text/html for a page or text/css for a stylesheet. The browser uses it to know how to read the bytes.",
  },
  {
    term: "origin",
    module: "Orientation: The Workshop",
    stage: "The Browser and URL Bar",
    explanation:
      "The scheme, host and port of a page taken together. Two addresses with the same origin may share cookies and storage; a different origin is kept separate for safety.",
  },
  {
    term: "status code",
    module: "Orientation: The Workshop",
    stage: "Serve and Open",
    explanation:
      "A three-digit number in the server's reply that says what happened: 200 means fine, 404 means not found, 500 means the server broke.",
  },
  {
    term: "parser",
    module: "Orientation: The Workshop",
    stage: "HTML Document Anatomy",
    explanation:
      "The part of the browser that reads source text and turns it into a structure it can work with. It also repairs mistakes, which is why the live page can differ from what you wrote.",
  },
  {
    term: "parse",
    module: "Orientation: The Workshop",
    stage: "Add and See the h1",
    explanation:
      "To read text and build a structure from it. When the browser parses HTML, it turns the tags into a tree of elements it can work with.",
  },
  {
    term: "DOM",
    module: "Orientation: The Workshop",
    stage: "Add and See the h1",
    explanation:
      "The Document Object Model: the browser's live tree of everything on the page. JavaScript can read and change it, and what you see in Elements is that tree, not your original file.",
  },
  {
    term: "node",
    module: "Orientation: The Workshop",
    stage: "Add and See the h1",
    explanation:
      "One item in a tree. In the DOM, an element, a piece of text and a comment are all nodes, which is why some DOM methods say node instead of element.",
  },
  {
    term: "paint",
    module: "Orientation: The Workshop",
    stage: "HTML Document Anatomy",
    explanation:
      "Drawing the page's pixels onto the screen after the browser has worked out where everything goes. A colour change can repaint without moving anything.",
  },
  {
    term: "accessibility",
    module: "Orientation: The Workshop",
    stage: "View Source vs the Live DOM",
    explanation:
      "Making a page usable by everyone, including people who navigate with a keyboard or a screen reader.",
  },
  {
    term: "selector",
    module: "Orientation: The Workshop",
    stage: "View Source vs the Live DOM",
    explanation:
      "The part of a CSS rule that says which elements it applies to, such as p for every paragraph or .card for everything with class card.",
  },
  {
    term: "repository",
    module: "Orientation: The Workshop",
    stage: "Git Basics",
    explanation:
      "The full history of a project's commits. The working tree is what you see now; the repository is every version you have saved.",
  },
  {
    term: "commit",
    module: "Orientation: The Workshop",
    stage: "Git Basics",
    explanation:
      "A saved snapshot of your files with a message saying what changed. It is the unit of history in git.",
  },
  {
    term: "staging area",
    module: "Orientation: The Workshop",
    stage: "Git Basics",
    explanation:
      "The waiting area for changes you want in your next commit. Adding a file here says 'include this', without saving it yet.",
  },

  {
    term: "DNS",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "The phone book of the internet: it turns a name like example.com into the numeric address a network actually uses.",
  },
  {
    term: "resolver",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "The server your computer asks when it needs to turn a name into an address. It does the looking-up for you and hands back the answer.",
  },
  {
    term: "root server",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "One of a small set of servers at the very top of DNS. They do not know every address, but they know which server to ask next for a given ending like .com.",
  },
  {
    term: "hosts file",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "A small file on your own computer that maps names to addresses. It is checked before DNS, so you can point a name somewhere else just for your machine.",
  },
  {
    term: "nameserver",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "A server that holds the DNS answers for a particular domain. Asking the right one is how a name gets turned into an address.",
  },
  {
    term: "authoritative",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "The server that has the final say for a domain's DNS records. An answer from anywhere else is a copy that may be out of date.",
  },
  {
    term: "TLD",
    aliases: ["top-level domain"],
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "Top-level domain: the last part of a name, like .com or .org. It is the step just below the root servers in a DNS lookup.",
  },
  {
    term: "record",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "One entry in DNS's phone book. An A record points a name at an IPv4 address, for example; the record is how that answer is stored.",
  },
  {
    term: "TTL",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "Time to live: how long a DNS answer may be kept before it must be looked up again. A longer TTL means faster visits but slower changes.",
  },
  {
    term: "propagate",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "To spread out. When a DNS answer changes, it takes time for the copies held by resolvers around the world to update.",
  },
  {
    term: "registrar",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "The company you buy a domain name from. It is where you manage the DNS settings that point your name at a server.",
  },
  {
    term: "IPv4",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "The older form of internet address, written as four numbers such as 127.0.0.1. There are not enough of them for every device.",
  },
  {
    term: "IPv6",
    module: "What Happens When You Hit Enter",
    stage: "DNS Resolution",
    explanation:
      "The newer form of internet address, much longer and written with colons, such as ::1. It exists because IPv4 ran out of room.",
  },
  {
    term: "TCP",
    module: "What Happens When You Hit Enter",
    stage: "TCP and TLS",
    explanation:
      "The rule for delivering data reliably and in order. It opens a connection before anything else is sent and checks that every piece arrived.",
  },
  {
    term: "TLS",
    module: "What Happens When You Hit Enter",
    stage: "TCP and TLS",
    explanation:
      "The encryption layer wrapped around a connection so nobody between you and the server can read or change what passes. HTTPS is HTTP over TLS.",
  },
  {
    term: "SYN",
    module: "What Happens When You Hit Enter",
    stage: "TCP and TLS",
    explanation:
      "A signal meaning 'I want to start a connection'. It is the first message in TCP's three-way handshake.",
  },
  {
    term: "ACK",
    module: "What Happens When You Hit Enter",
    stage: "TCP and TLS",
    explanation:
      "A signal meaning 'I received that'. It is the last message in TCP's three-way handshake.",
  },
  {
    term: "certificate",
    module: "What Happens When You Hit Enter",
    stage: "TCP and TLS",
    explanation:
      "A digital ID a server shows to prove it is who it claims to be. Your browser checks it against trusted authorities before starting an encrypted connection.",
  },
  {
    term: "encryption",
    module: "What Happens When You Hit Enter",
    stage: "TCP and TLS",
    explanation:
      "Scrambling data so only the two ends of a conversation can read it.",
  },
  {
    term: "cookie",
    module: "What Happens When You Hit Enter",
    stage: "Request and Response Headers",
    explanation:
      "A small piece of data a server asks the browser to keep and send back with later requests, so the site can remember you.",
  },
  {
    term: "compression",
    module: "What Happens When You Hit Enter",
    stage: "Request and Response Headers",
    explanation:
      "Shrinking a response before it is sent so it travels faster. The browser unpacks it again on arrival.",
  },
  {
    term: "TTFB",
    module: "What Happens When You Hit Enter",
    stage: "Fetch and Response",
    explanation:
      "Time to first byte: how long the server took before the very first piece of the reply arrived.",
  },
  {
    term: "CSSOM",
    module: "What Happens When You Hit Enter",
    stage: "Parse HTML and CSS",
    explanation:
      "The CSS Object Model: the tree the browser builds from your stylesheets so it can work out which rules apply to which elements.",
  },
  {
    term: "preload",
    module: "What Happens When You Hit Enter",
    stage: "Parse HTML and CSS",
    explanation:
      "Fetching something early, before the browser has finished reading the page and discovered it in the normal way.",
  },
  {
    term: "composite",
    module: "What Happens When You Hit Enter",
    stage: "Bytes to Pixels",
    explanation:
      "Putting the finished layers of the page together in the right order to make the final picture on screen.",
  },
  {
    term: "waterfall",
    module: "What Happens When You Hit Enter",
    stage: "Request List and Refresh",
    explanation:
      "A chart in the Network panel showing when each request started and finished, so you can see which one held the page up.",
  },
  {
    term: "redirect",
    module: "What Happens When You Hit Enter",
    stage: "Request List and Refresh",
    explanation:
      "When a server replies 'the thing you want has moved' and gives the browser a new address to try.",
  },
  {
    term: "preflight",
    module: "What Happens When You Hit Enter",
    stage: "Inspecting Failed Requests",
    explanation:
      "A quick check request a browser sends before a cross-origin request, asking whether the other site allows it.",
  },
  {
    term: "JSON",
    module: "What Happens When You Hit Enter",
    stage: "Inspecting Failed Requests",
    explanation:
      "A way of writing data as text using objects and lists. It is the most common format for data sent between a browser and a server.",
  },
  {
    term: "lookup",
    module: "What Happens When You Hit Enter",
    stage: "Waterfall Reading",
    explanation:
      "Looking something up in a table. A DNS lookup turns a name into an address; the lookup bar in a waterfall chart is the time that step took.",
  },

  {
    term: "compositor",
    module: "Inside the Browser",
    stage: "Layout and Reflow",
    explanation:
      "The part of the browser that takes finished layers and puts them together on screen. It can move a layer without redrawing the page.",
  },
  {
    term: "rasterize",
    module: "Inside the Browser",
    stage: "Paint and Composite",
    explanation: "Turning a description of shapes and text into actual pixels.",
  },
  {
    term: "frame",
    module: "Inside the Browser",
    stage: "Paint and Composite",
    explanation:
      "One complete picture the browser draws on screen. At 60 frames a second it has about 16.67 milliseconds to do all its work.",
  },
  {
    term: "defer",
    module: "Inside the Browser",
    stage: "Render-Blocking Resources",
    explanation:
      "An instruction on a script tag that lets the file download while the page is still being read, then runs it once reading is finished.",
  },
  {
    term: "FCP",
    module: "Inside the Browser",
    stage: "First Paint Timing",
    explanation:
      "First Contentful Paint: the moment the first piece of text or image appears on screen.",
  },
  {
    term: "LCP",
    module: "Inside the Browser",
    stage: "First Paint Timing",
    explanation:
      "Largest Contentful Paint: the moment the biggest visible thing finishes appearing. It is the loading score in Core Web Vitals.",
  },
  {
    term: "scope",
    module: "Inside the Browser",
    stage: "Async, Defer, and Module Scripts",
    explanation:
      "The region of a program where a name is available. A variable declared inside a function is not visible outside its scope.",
  },
  {
    term: "listener",
    module: "Inside the Browser",
    stage: "Async, Defer, and Module Scripts",
    explanation:
      "A function registered to run when a particular event happens, such as a click. Also called an event handler.",
  },

  {
    term: "declaration",
    module: "CSS: The Styling Layer",
    stage: "A Rule Has Three Parts",
    explanation:
      "One property-and-value pair inside a CSS rule, like color: red. A rule's block is made of declarations.",
  },
  {
    term: "aria-current",
    module: "CSS: The Styling Layer",
    stage: "Combinators and State",
    explanation:
      "An ARIA attribute that marks which item in a set is the current one, such as the page you are on in a menu. Screen readers can announce it; sighted readers get the styling on that item.",
  },
  {
    term: "attribute",
    module: "CSS: The Styling Layer",
    stage: "Combinators and State",
    explanation:
      "Extra information on an HTML tag, like href on a link or type on an input. CSS can select elements by their attributes.",
  },
  {
    term: "keyframe",
    module: "CSS: The Styling Layer",
    stage: "Keyframe Animations",
    explanation:
      "One stop in an animation, describing what the element should look like at a particular point in time.",
  },
  {
    term: "easing",
    module: "CSS: The Styling Layer",
    stage: "Transitions: From State to State",
    explanation:
      "How an animation speeds up and slows down. Linear feels mechanical; ease-out starts fast and settles gently.",
  },
  {
    term: "gradient",
    module: "CSS: The Styling Layer",
    stage: "Keyframe Animations",
    explanation:
      "A smooth blend between colours, used as a background or to make a shimmer effect.",
  },
  {
    term: "overflow",
    module: "CSS: The Styling Layer",
    stage: "box-sizing: border-box",
    explanation:
      "What happens when content is bigger than the box it sits in. Setting it to auto gives the box its own scrollbar.",
  },
  {
    term: "flexbox",
    module: "CSS: The Styling Layer",
    stage: "Flex Is One Dimension",
    explanation:
      "A layout system for arranging things along one line, either across or down, that shares out the space for you.",
  },
  {
    term: "stacking context",
    module: "CSS: The Styling Layer",
    stage: "Stacking Order and z-index",
    explanation:
      "A group of elements whose front-to-back order is decided together. z-index values only compete inside the same context.",
  },
  {
    term: "transition",
    module: "CSS: The Styling Layer",
    stage: "Transitions: From State to State",
    explanation:
      "A change that animates smoothly between two values instead of snapping instantly.",
  },
  {
    term: "contrast",
    module: "CSS: The Styling Layer",
    stage: "Color Models and Contrast",
    explanation:
      "How different two colours are in brightness. Enough contrast keeps text readable for people with low vision.",
  },

  {
    term: "undefined",
    module: "JavaScript Survival Kit",
    stage: "Primitives",
    explanation:
      "The value a variable has before you give it one, or what a function returns when it returns nothing. It means 'no value here'.",
  },
  {
    term: "truthy",
    module: "JavaScript Survival Kit",
    stage: "Type Conversion",
    explanation:
      "A value that counts as true when JavaScript has to make a yes-or-no decision. Most values are truthy, even an empty array.",
  },
  {
    term: "falsy",
    module: "JavaScript Survival Kit",
    stage: "Type Conversion",
    explanation:
      "A value that counts as false when JavaScript has to make a yes-or-no decision: false, 0, an empty string, null, undefined and NaN.",
  },
  {
    term: "expression",
    module: "JavaScript Survival Kit",
    stage: "Function Declarations and Arrows",
    explanation:
      "A piece of code that produces a value, such as 2 + 3. It can be used wherever a value is expected.",
  },
  {
    term: "statement",
    module: "JavaScript Survival Kit",
    stage: "switch and Lookup Tables",
    explanation:
      "One complete instruction in a program, such as an if or a switch. It does something rather than producing a value.",
  },
  {
    term: "literal",
    module: "JavaScript Survival Kit",
    stage: "Objects and Dot Access",
    explanation:
      "A value written directly in code rather than built or looked up: 42, 'hello', or { name: 'Ada' }.",
  },
  {
    term: "reference",
    module: "JavaScript Survival Kit",
    stage: "Objects and Dot Access",
    explanation:
      "When two variables point at the same object rather than each holding a copy. Changing the object through one changes what the other sees.",
  },
  {
    term: "callback",
    module: "JavaScript Survival Kit",
    stage: "Function Declarations and Arrows",
    explanation:
      "A function you hand to another function for it to call later, usually when something finishes or happens.",
  },

  {
    term: "NodeList",
    module: "The DOM Is an API",
    stage: "querySelector",
    explanation:
      "A list of elements returned by methods like querySelectorAll. It is static: it does not change if the page changes afterwards.",
  },
  {
    term: "HTMLCollection",
    module: "The DOM Is an API",
    stage: "getElementById Contrast",
    explanation:
      "A list of elements returned by older DOM methods. It is live: it updates itself as the page changes.",
  },
  {
    term: "XSS",
    module: "The DOM Is an API",
    stage: "createElement and textContent",
    explanation:
      "Cross-site scripting: when untrusted text is treated as HTML and runs as code on your page. Using textContent instead of innerHTML prevents it.",
  },
  {
    term: "traversal",
    module: "The DOM Is an API",
    stage: "Traversal",
    explanation:
      "Moving around the DOM by family relationships: up to a parent, down to children, sideways to siblings.",
  },

  {
    term: "bubbling",
    module: "Events: The Page Talks Back",
    stage: "The Event Object",
    explanation:
      "When an event starts at the thing you clicked and travels up through its ancestors, so a parent can listen for clicks on its children.",
  },
  {
    term: "capture",
    module: "Events: The Page Talks Back",
    stage: "The Three Phases",
    explanation:
      "The opposite of bubbling: an event travels down from the top of the tree to the thing you clicked, before the target handlers run.",
  },
  {
    term: "dispatch",
    module: "Events: The Page Talks Back",
    stage: "The Three Phases",
    explanation:
      "Sending an event so that listeners get a chance to run. The browser dispatches the click after you press a button.",
  },
  {
    term: "preventDefault",
    module: "Events: The Page Talks Back",
    stage: "The Event Object",
    explanation:
      "Cancelling the action the browser would normally take, such as following a link or submitting a form.",
  },
  {
    term: "stopPropagation",
    module: "Events: The Page Talks Back",
    stage: "The Event Object",
    explanation:
      "Stopping an event from travelling further up or down the tree, so ancestors do not hear about it.",
  },
  {
    term: "API",
    module: "Events: The Page Talks Back",
    stage: "addEventListener",
    explanation:
      "Application Programming Interface: the set of names and rules a piece of software offers so your code can talk to it.",
  },

  {
    term: "reducer",
    module: "JavaScript Core",
    stage: "reduce",
    explanation:
      "The function you give to reduce. It takes the answer so far and the next item, and returns the new answer.",
  },
  {
    term: "deep copy",
    module: "JavaScript Core",
    stage: "Shallow vs Deep Copies",
    explanation:
      "A copy that duplicates the nested objects and arrays too, so changing the copy cannot change the original.",
  },
  {
    term: "template literal",
    module: "JavaScript Core",
    stage: "Template Literals",
    explanation:
      "A string written with backticks that can contain expressions inside ${...}. It is the modern way to build strings with values in them.",
  },
  {
    term: "constructor",
    module: "JavaScript Core",
    stage: "Arrow Functions and this",
    explanation:
      "The function that runs when you create an object with new. It sets up the new object's starting values.",
  },
  {
    term: "serialize",
    module: "JavaScript Core",
    stage: "Set and Map",
    explanation:
      "Turning a value into a string or stream of bytes that can be stored or sent. JSON.stringify serialises to JSON.",
  },
  {
    term: "instance",
    module: "JavaScript Core",
    stage: "Shallow vs Deep Copies",
    explanation:
      "One object made from a class. The class is the recipe; an instance is an actual thing made from it.",
  },
  {
    term: "router",
    module: "JavaScript Core",
    stage: "URL and URLSearchParams",
    explanation:
      "The part of a site that decides which screen to show for each address, and lets links change address without a full reload.",
  },
  {
    term: "params",
    module: "JavaScript Core",
    stage: "URL and URLSearchParams",
    explanation:
      "Short for parameters: the named values in a URL's query string or in a route, such as a page number.",
  },
  {
    term: "Vite",
    module: "JavaScript Core",
    stage: "Modules",
    explanation:
      "A build tool that runs your project while you work and bundles it for release. It is what 'npm create vite' sets up.",
  },

  {
    term: "timeout",
    module: "Async and the Event Loop",
    stage: "Call Stack and Sync",
    explanation:
      "A limit on how long something may wait. AbortSignal.timeout makes a request give up after a set time instead of hanging forever.",
  },
  {
    term: "endpoint",
    module: "Async and the Event Loop",
    stage: "Error Handling Patterns",
    explanation:
      "One specific address you can call on a server to do something or get some data.",
  },

  {
    term: "props",
    module: "State",
    stage: "What State Is",
    explanation:
      "Short for properties: the values a parent component passes down to a child. A component cannot change them itself.",
  },
  {
    term: "JSX",
    module: "State",
    stage: "Props Are Inputs",
    explanation:
      "The HTML-like syntax used in React files to describe what a component should render. It is turned into JavaScript before the browser sees it.",
  },
  {
    term: "dependency",
    module: "State",
    stage: "Derived State",
    explanation:
      "A value an effect or memo depends on. When it changes, React runs the effect again or recalculates the result.",
  },
  {
    term: "controlled",
    module: "State",
    stage: "Form State",
    explanation:
      "A form field whose value is kept in React state, so your code decides what it shows after every keystroke.",
  },
  {
    term: "ref",
    module: "State",
    stage: "When Not to Use State",
    explanation:
      "A mutable box from useRef that can hold a value without causing a re-render, often used to reach an element directly.",
  },
  {
    term: "lazy",
    module: "State",
    stage: "useReducer in Practice",
    explanation:
      "Waiting until something is actually needed before doing the work. Lazy initialization computes a starting value only once.",
  },

  {
    term: "uncontrolled",
    module: "React Basics",
    stage: "Textarea, File, and Uncontrolled",
    explanation:
      "A form field the browser owns. It keeps its own value and React only reads it when needed.",
  },
  {
    term: "diff",
    module: "React Basics",
    stage: "Render and Reconcile",
    explanation:
      "Comparing the new description of the page with the old one to find the smallest set of changes. React does this before touching the real DOM.",
  },
  {
    term: "npm",
    module: "React Basics",
    stage: "Vite and JSX",
    explanation:
      "The tool that installs JavaScript packages and runs the scripts listed in package.json.",
  },
  {
    term: "Suspense",
    module: "React Basics",
    stage: "Lazy Loading and Suspense",
    explanation:
      "A React component that shows a fallback while another part of the page is still loading.",
  },
  {
    term: "portal",
    module: "React Basics",
    stage: "Portals and Dialogs",
    explanation:
      "Rendering something into a different place in the page from where it was written, so it can sit above everything else.",
  },

  {
    term: "merge",
    module: "Shipping It",
    stage: "Pull Requests",
    explanation:
      "Bringing the changes from one branch into another. A pull request asks for that to happen.",
  },
  {
    term: "CLS",
    module: "Shipping It",
    stage: "Performance and Core Web Vitals",
    explanation:
      "Cumulative Layout Shift: a score for how much the page jumps around while it loads. Lower is better.",
  },
];

/** The entries that belong on one stage, in the order they were authored. */
export function glossaryForStage(
  moduleTitle: string,
  stageTitle: string,
): GlossaryEntry[] {
  return GLOSSARY.filter(
    (entry) => entry.module === moduleTitle && entry.stage === stageTitle,
  );
}

/** The entries grouped by module, ordered the way the course is ordered. */
export function glossaryByModule(
  moduleOrder: Map<string, number>,
): { module: string; entries: GlossaryEntry[] }[] {
  const groups = new Map<string, GlossaryEntry[]>();
  for (const entry of GLOSSARY) {
    const list = groups.get(entry.module) ?? [];
    list.push(entry);
    groups.set(entry.module, list);
  }
  return [...groups.entries()]
    .map(([module, entries]) => ({
      module,
      entries: [...entries].sort((a, b) => a.term.localeCompare(b.term)),
    }))
    .sort(
      (a, b) =>
        (moduleOrder.get(a.module) ?? 99) - (moduleOrder.get(b.module) ?? 99),
    );
}
