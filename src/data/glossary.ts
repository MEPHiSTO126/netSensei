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
    stage: "Status Codes and Timings",
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
    stage: "useRef",
    explanation:
      "A value that can be changed after it is made, like an object or an array. `useRef` gives you one, so you can keep a value without causing a re-render.",
  },
  {
    term: "memo",
    module: "State",
    stage: "Memoization",
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
