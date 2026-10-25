import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

type StageSeed = {
  title: string;
  type: "TEXT" | "IMAGE" | "CHART";
  content: string;
};

type PhaseSeed = {
  title: string;
  order: number;
  description?: string;
  stages: StageSeed[];
  quiz?: {
    passThreshold?: number;
    questions: Array<{
      type: "SNIPPET" | "TEXT" | "AUDIO";
      prompt: string;
      fullGoal?: string;
      expectedAnswer?: string;
      rubric?: string;
      points?: number;
    }>;
  };
};

type ModuleSeed = {
  title: string;
  order: number;
  description?: string;
  phases: PhaseSeed[];
};

const modules: ModuleSeed[] = [
  {
    title: "Orientation: The Workshop",
    order: 1,
    description: "Meet the four panes of the workshop: editor, browser, terminal, and the run loop.",
    phases: [
      {
        title: "Meet the Workshop",
        order: 1,
        description: "Learn the four panes of the development workshop and the edit-save-refresh loop.",
        stages: [
          { title: "The Editor and File Explorer", type: "TEXT", content: "The editor is where you write code. The file explorer shows your folder tree. A file is a path; folders are folders. You will keep all course code in one project folder." },
          { title: "The Browser and URL Bar", type: "TEXT", content: "The browser displays your running page. The URL bar shows the address. Refreshing after a save is how you see changes. The local server serves your files over HTTP on localhost." },
          { title: "The Terminal", type: "TEXT", content: "The terminal runs the local server (for example Vite or npx serve) and runs build/CLI commands. Keep it open alongside the editor and browser." },
          { title: "The Loop", type: "CHART", content: "The development loop: write code in editor → save → browser auto-updates or refresh → read result → repeat. This loop runs hundreds of times per learning session." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What are the four panes of the workshop?", fullGoal: "List the four panes and what each does.", expectedAnswer: "Editor, browser, terminal, and the run loop.", rubric: "Check the student names all four panes and their roles.", points: 1 },
            { type: "TEXT", prompt: "After saving a file, what is the first thing you do to see the change?", expectedAnswer: "Refresh the browser or rely on auto-reload.", rubric: "Check the student knows refresh / auto-reload.", points: 1 },
          ],
        },
      },
      {
        title: "First Page and Run It",
        order: 2,
        description: "Create index.html, understand document anatomy, and serve your first page.",
        stages: [
          { title: "HTML Document Anatomy", type: "TEXT", content: "An HTML document has four parts: doctype, html, head, and body. The doctype declares standards mode. head holds metadata and links. body holds visible content." },
          { title: "Serve and Open", type: "TEXT", content: "Run the local server from the terminal, then open the URL in the browser (for example http://localhost:3000). A static server just serves the files you give it." },
          { title: "Add and See the h1", type: "TEXT", content: "Add an h1 inside body and save. Refresh to see it. The browser only knows about what is in the document." },
          { title: "File Paths and Relative References", type: "TEXT", content: "Resources like CSS and images are referenced by relative paths from the document. A missing file shows a 404. Understand the relationship between URL path and file path." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What are the four parts of an HTML document?", expectedAnswer: "Doctype, html, head, body.", rubric: "Check all four are named correctly.", points: 1 },
            { type: "TEXT", prompt: "If a CSS file is linked with a relative path and the server returns 404, what does that mean?", expectedAnswer: "The file path does not match the served location.", rubric: "Check the student can connect path → 404.", points: 1 },
          ],
        },
      },
      {
        title: "Reading Tools",
        order: 3,
        description: "DevTools basics, reading errors plainly, and first git steps.",
        stages: [
          { title: "DevTools Elements and Console", type: "TEXT", content: "DevTools has Elements (DOM tree), Console (logs/errors), Sources, Network, Performance. Learn to read console errors as plain sentences with context." },
          { title: "Reading Errors Plainly", type: "TEXT", content: "Errors are not punishments. Read the message, find the file and line, form a hypothesis, test. Write down what you expected vs what happened." },
          { title: "Git Basics", type: "TEXT", content: "Learn git init, add, commit, status. Commit early and often. These are the only git commands needed at this stage." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "When the console shows a 404 for a stylesheet, what is the first thing you check?", expectedAnswer: "The path referenced in the HTML and whether the file exists at that relative location.", rubric: "Check path/404 reasoning.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "What Happens When You Hit Enter",
    order: 2,
    description: "How the browser fetches and renders a page: DNS, HTTP, critical rendering path.",
    phases: [
      {
        title: "The Wire",
        order: 1,
        description: "From the moment you press Enter to the response arriving.",
        stages: [
          { title: "DNS Resolution", type: "TEXT", content: "DNS translates the domain name into an IP address. Without DNS there is no conversation. Cache and TTL affect how long a lookup may be reused." },
          { title: "TCP and TLS", type: "TEXT", content: "TCP opens a connection (three-way handshake). TLS wraps it for security (HTTPS). Status codes begin at the transport/session layer boundary." },
          { title: "HTTP Methods and Status Codes", type: "CHART", content: "GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error. Learn the common ones: 200, 301, 302, 304, 400, 401, 403, 404, 500, 503." },
          { title: "URL Anatomy", type: "TEXT", content: "URL = scheme (https), host (domain), port (default 443), path (/resource), query (?key=value). Each part has meaning for caching, routing, and semantics." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What does an HTTP status code of 301 mean when a student moves a site?", expectedAnswer: "Permanent redirect; browser should fetch the new location.", rubric: "Check redirect understanding.", points: 1 },
            { type: "TEXT", prompt: "What is the difference between TCP and TLS?", expectedAnswer: "TCP is the transport protocol (connection); TLS is the security layer that runs over it (encryption/handshake).", rubric: "Check layered understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Critical Rendering Path from the Network View",
        order: 2,
        description: "How the browser turns a fetched response into painted pixels.",
        stages: [
          { title: "Fetch and Response", type: "TEXT", content: "Browser fetches over HTTP, receives bytes, parses. Network timing (TTFB, download, first contentful paint) is visible in DevTools." },
          { title: "Parse HTML and CSS", type: "TEXT", content: "HTML builds DOM; CSS builds CSSOM; then they combine into a render tree. Parsing is sequential; render-blocking resources delay first paint." },
          { title: "Layout, Paint, Composite", type: "CHART", content: "Render tree → layout (compute geometry) → paint (rasterize) → composite (layers). Frame budget: 16.67ms per 60fps frame; multiple layers can composite in parallel." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What is the difference between layout and paint?", expectedAnswer: "Layout computes geometry (positions/sizes); paint rasterizes visual pixels. Layout can trigger repaint; paint is part of one frame.", rubric: "Check pipeline understanding.", points: 1 },
          ],
        },
      },
      {
        title: "DevTools Network Panel",
        order: 3,
        description: "Using the Network panel to diagnose requests, timings, and status codes.",
        stages: [
          { title: "Request List and Refresh", type: "TEXT", content: "Open DevTools → Network, reload, watch the request list. Identify resources: document, stylesheet, script, image, font, XHR/fetch." },
          { title: "Status Codes and Timings", type: "TEXT", content: "Read status codes and timing breakdown (TTFB, content download, first contentful paint). Use timings to explain slow loads." },
          { title: "Inspecting Failed Requests", type: "TEXT", content: "Filter failed requests (red), inspect headers/body of errors to find root cause. Correlate with server logs." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "A page loads but a hero image 404s. What do you check first?", expectedAnswer: "The URL/path in HTML and whether the asset exists in the project; check Network panel status.", rubric: "Check diagnosis loop.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "Inside the Browser",
    order: 3,
    description: "Deep dive into DOM, CSSOM, rendering pipeline, and frame budget.",
    phases: [
      {
        title: "DOM, CSSOM, Render Tree",
        order: 1,
        description: "How the browser's two trees merge into one render tree.",
        stages: [
          { title: "DOM Tree", type: "TEXT", content: "DOM is a tree of nodes representing the document structure. HTML parsed into DOM; CSS parsed into CSSOM." },
          { title: "CSSOM", type: "TEXT", content: "CSSOM is the map of style rules. Styles apply to DOM nodes. Understanding CSSOM clarifies selector → element application." },
          { title: "Render Tree", type: "TEXT", content: "Combine DOM and CSSOM into render tree (only nodes with styles). Then layout, paint, composite." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What is the difference between the DOM and the render tree?", expectedAnswer: "DOM is the structure; render tree adds styling info to produce a renderable tree.", rubric: "Check structural understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Layout, Paint, Composite, Frame Budget",
        order: 2,
        description: "Rendering pipeline performance fundamentals.",
        stages: [
          { title: "Layout and Reflow", type: "TEXT", content: "Layout computes geometry (position/size) for render tree nodes. Reflow is re-layout when something that affects layout changes. Repaint redraws; compositing moves layers." },
          { title: "Paint and Composite", type: "TEXT", content: "Paint rasterizes visual; composite assembles layers. Repaint vs repaint-layer vs compositor are distinct costs. Frame budget 16.67ms at 60fps." },
          { title: "Reflow vs Repaint vs Composite", type: "CHART", content: "Reflow = layout recomputation; Repaint = rasterize changed pixels; Composite = layer compositing. Costs differ; prefer transform/opacity for animation to hit frame budget." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Why does animating transform instead of top/left help meet the frame budget?", expectedAnswer: "Transform animations are compositor-friendly and avoid layout/reflow.", rubric: "Check performance understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Blocking and First Paint",
        order: 3,
        description: "What blocks first paint and how to reduce blocking.",
        stages: [
          { title: "Render-Blocking Resources", type: "TEXT", content: "CSS and synchronous scripts block first paint. Async/defer scripts change ordering. Inline critical CSS is a mitigation." },
          { title: "First Paint Timing", type: "TEXT", content: "First paint marks the first rendered pixel. Metrics: FCP, TTFB. Reduce blocking to improve FCP." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What makes a page render-blocking before first paint?", expectedAnswer: "CSS in head and synchronous scripts block rendering.", rubric: "Check blocking concept.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "JavaScript Survival Kit",
    order: 4,
    description: "Just enough JavaScript before the DOM and events: values, types, functions, control flow, objects, arrays, scope, hoisting, errors, debugger.",
    phases: [
      {
        title: "Values and Types",
        order: 1,
        description: "Primitives and declarations.",
        stages: [
          { title: "Primitives", type: "TEXT", content: "JavaScript gives you building blocks, and the first thing to own is what a primitive is. A primitive holds one value and cannot be changed — it is immutable. The ones you will meet first: string, number, boolean, null, and undefined.\n\nA string is text you write in quotes: \"hello\" or 'hello'. A number is numeric: 42, 3.14, -7. A boolean is either true or false. null means \"intentionally empty\" — a value that exists to mean nothing. undefined means \"not provided\" — the default for a missing value.\n\nWatch the null quirk early: typeof null returns \"object\" even though null is really an object-wrapped primitive. That surprise trips up nearly every learner, so we name it here instead of hiding it.\n\nPrimitives are compared by value. That is why strict equality (===) checks both value and type. The string \"1\" and the number 1 are different types, so \"1\" === 1 is false — no silent conversion happens." },
          { title: "let and const vs var", type: "TEXT", content: "let and const are block-scoped: they live inside the nearest {} block. var is function-scoped, which means it escapes blocks — a classic source of bugs. Because of that, prefer let and const by default and reserve var for old code you have to read.\n\nconst means the binding cannot be reassigned, not that the value cannot be an object that you mutate. For primitives like strings and numbers, const gives you immutability. Use let when a value will change; use const when it will not." },
          { title: "typeof", type: "TEXT", content: "typeof is a JavaScript operator that returns a string describing the type of a value. typeof \"hello\" is \"string\", typeof 42 is \"number\", typeof true is \"boolean\". For null it famously returns \"object\", which is why the null quirk above matters.\n\nYou will use typeof to check what kind of data you are holding — for guards, for logging, and for debugging. When you are unsure, typeof is the first tool to reach for." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What does typeof null return in JavaScript?", fullGoal: "Explain what typeof returns for the main primitive types and why null is the famous exception.", expectedAnswer: "typeof returns the type string for primitives; for null it returns \"object\" due to a long-standing implementation quirk.", rubric: "Check the student explains the typeof quirk correctly, not just the returned value.", points: 1 },
          ],
        },
      },
      {
        title: "Functions and Control Flow",
        order: 2,
        description: "Functions, return, conditionals, truthiness.",
        stages: [
          { title: "Function Declarations and Arrows", type: "TEXT", content: "Functions are reusable blocks of logic, and in JavaScript functions are values. A function declaration starts with the keyword function and is hoisted, so it is available before its definition line. An arrow function uses => and is often written as an expression, with implicit return when the body is a single expression.\n\nBecause functions are first-class, you can assign them to variables, pass them as arguments, and return them from other functions. That is the foundation for callbacks, which you will meet soon." },
          { title: "Return and Conditionals", type: "TEXT", content: "return exits the current function and can hand back a value. Without return, the function simply returns undefined. Code after a return never runs.\n\nConditionals are built from if / else if / else. An if runs its block when the condition is truthy; else runs when it is not. Conditions are evaluated by truthiness — false, 0, \"\", null, undefined, and NaN are falsy, and everything else is truthy. Always compare with === for equality so no coercion sneaks in." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Write a JavaScript function that takes a number and returns true when the number is even.", fullGoal: "Write a function isEven(n) that returns true when n is even, using the remainder operator.", expectedAnswer: "function isEven(n) { return n % 2 === 0; }", rubric: "Check function syntax, return usage, and modulo logic.", points: 1 },
          ],
        },
      },
      {
        title: "Objects and Arrays",
        order: 3,
        description: "Object literals, array methods, iteration.",
        stages: [
          { title: "Objects and Dot Access", type: "TEXT", content: "An object groups related values under named keys. Write it as a literal: { name: \"Ada\", role: \"Engineer\" }. Access with dot for known keys: obj.name. Use bracket notation obj[\"name\"] when the key is dynamic or computed. Keys are strings; camelCase is the convention.\n\nObjects can nest: obj.address.city reads an address object inside an address key. Read deeply one level at a time until it feels natural." },
          { title: "Arrays and forEach", type: "TEXT", content: "An array holds an ordered list of values: [\"Ada\", \"Grace\", \"Linus\"]. Access by index starting at 0; the last valid index is length - 1, so length tells you how many items you have.\n\nforEach is a built-in array method that runs a function once per element, in order, passing each element to the callback. It does not build a new array — it runs side logic per item. Later you will meet map, filter, and reduce for transforming arrays into new arrays." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Given const names = [\"Ada\", \"Grace\", \"Linus\"]; what does names.forEach do?", fullGoal: "Explain what array.forEach does with the array elements and the callback.", expectedAnswer: "forEach runs the callback once per element, in order, passing each element; it does not return a new array.", rubric: "Check iteration understanding (callback receives each element).", points: 1 },
          ],
        },
      },
      {
        title: "Scope and Hoisting",
        order: 4,
        description: "Scope rules and hoisting behavior.",
        stages: [
          { title: "Scope", type: "TEXT", content: "Scope is the set of variables a function can see. Function scope means variables live inside the function they are declared in. Block scope means variables live inside the nearest { } block — and let and const are block-scoped, unlike function-scoped var.\n\nYou will see bugs where a loop variable \"leaks\" because var was used, or where a variable you thought was block-scoped is actually function-scoped. Prefer let and const and you remove whole categories of scope bugs." },
          { title: "Hoisting", type: "TEXT", content: "Function declarations are hoisted: the whole function is available before its definition line. let and const are hoisted too, but they start in an uninitialized state — the temporal dead zone — until the declaration line executes. Reading them before that throws a ReferenceError.\n\nThis is why you should declare variables before use, and why calling a function before its declaration line works for function declarations but not for let/const." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What error do you get if you read a let variable before its declaration line has executed?", fullGoal: "Explain what happens when a let binding is accessed before initialization, and why.", expectedAnswer: "ReferenceError: temporal dead zone (TDZ) — let and const are hoisted but uninitialized until the declaration line runs.", rubric: "Check the student knows about hoisting and the temporal dead zone.", points: 1 },
          ],
        },
      },
      {
        title: "Errors and Debugger",
        order: 5,
        description: "Error handling and browser DevTools debugging.",
        stages: [
          { title: "try and catch", type: "TEXT", content: "Errors are objects that carry a message. You can wrap risky work in try / catch / finally. try runs the code; catch handles the error when one is thrown; finally always runs when the block completes, whether or not an error happened.\n\nFor expected problems — like bad user input — validate first, or catch and respond with a clear message. Do not use catch to hide bugs you do not understand." },
          { title: "Reading Errors and Debugger", type: "TEXT", content: "Read error messages plainly: the error type, the file, the line, and the message. Build a hypothesis about the cause, then test it.\n\nWhen a bug is stubborn, use the browser DevTools Sources panel: set a breakpoint, reload, and step through code line by line. That turns \"it broke\" into a conversation you can debug." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "How should you handle an error you expect in user input?", fullGoal: "Describe how to handle an expected error in user input.", expectedAnswer: "Validate before the risky operation, or wrap the operation in try/catch and handle the error gracefully.", rubric: "Check error-handling basics (validate or try/catch).", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "The DOM Is an API",
    order: 5,
    description: "Selecting, creating, updating, traversing the DOM, and keeping updates safe.",
    phases: [
      {
        title: "Selecting",
        order: 1,
        description: "querySelector and friends.",
        stages: [
          { title: "querySelector", type: "TEXT", content: "querySelector takes a CSS selector string and returns the first element that matches. querySelectorAll returns all matching elements as a NodeList. Use querySelector when you need one element and querySelectorAll when you need the collection.\n\nThe selector language is CSS, so \".hero .title\" reads the way you would style it. That is the power: one syntax for finding and styling. Start simple — tag names, class names, ids — and add complexity only when the page demands it." },
          { title: "getElementById Contrast", type: "TEXT", content: "getElementById is a shortcut for one specific case: an element whose id is \"...\". It is fast and simple, but it only handles ids — no classes, no tags, no nesting. querySelector handles all of CSS. Use getElementById for the simple id case and querySelector for anything richer." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "When should you use querySelector over getElementById?", fullGoal: "Choose the right DOM selection method for a task.", expectedAnswer: "Use querySelector when the selection is CSS-selector based rather than id-based; use getElementById for simple id lookups.", rubric: "Check API selection understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Creating and Updating",
        order: 2,
        description: "createElement, textContent vs innerHTML, classList, dataset.",
        stages: [
          { title: "createElement and textContent", type: "TEXT", content: "createElement builds a new element of a given tag: document.createElement(\"button\"). Then you can set properties and attach it.\n\ntextContent sets text inside an element and treats it as plain text — it does not interpret HTML, which is why it is the safe choice for user-provided strings. innerHTML injects HTML markup, which means user input could become elements or scripts. Prefer textContent unless you truly mean to render markup." },
          { title: "classList and dataset", type: "TEXT", content: "classList manages classes on an element with add, remove, and contains. dataset reads and writes data-* attributes (data-name becomes dataset.name). Both are how you wire behaviour and styling without touching innerHTML." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Why prefer textContent over innerHTML when inserting user-provided strings?", fullGoal: "Explain why textContent is the safe choice over innerHTML for user-provided strings.", expectedAnswer: "textContent treats content as plain text; innerHTML parses HTML (XSS risk).", rubric: "Check safe-practice understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Traversing and Safety",
        order: 3,
        description: "DOM traversal and safe updates.",
        stages: [
          { title: "Traversal", type: "TEXT", content: "parentElement, children, nextElementSibling, and previousElementSibling let you walk the tree — up one level, down into children, sideways to siblings. Use them when you need to move or reshape DOM programmatically, for example reordering a list." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "How do you move a node to a different parent safely?", fullGoal: "Describe the safe way to move a DOM node to a new parent.", expectedAnswer: "Use appendChild or insertBefore with a reference node; directly reassigning the parent is error-prone.", rubric: "Check DOM API understanding.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "Events: The Page Talks Back",
    order: 6,
    description: "addEventListener, bubbling, delegation, forms, keyboard access.",
    phases: [
      {
        title: "First Listeners",
        order: 1,
        description: "addEventListener and the event object.",
        stages: [
          { title: "addEventListener", type: "TEXT", content: "addEventListener(type, handler) registers a listener for an event type, and the handler receives an event object carrying type, target, currentTarget, and methods such as preventDefault.\n\nPrefer addEventListener over inline handlers because you can register many listeners, and you can later remove a listener with removeEventListener. The event object is your channel to the outside world — you read which key or action fired and can stop default behaviour." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What does the event object provide for handling user actions?", fullGoal: "List the useful fields and methods of the event object for handling user actions.", expectedAnswer: "Type, target, currentTarget, and methods like preventDefault.", rubric: "Check event object understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Bubbling and Delegation",
        order: 2,
        description: "Event propagation and delegated listeners.",
        stages: [
          { title: "Bubbling", type: "TEXT", content: "Event flow starts at the target and bubbles up through its ancestors to the document. Delegation exploits this: attach one listener to a common ancestor and use event.target to know which child fired.\n\nThat lets one listener handle many children — a list of buttons, a row of cards — without binding each one separately." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Why is event delegation useful?", fullGoal: "Explain the benefit of event delegation.", expectedAnswer: "One listener on a common ancestor handles children; add/remove without re-binding.", rubric: "Check delegation understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Forms and Keyboard",
        order: 3,
        description: "Submit handling and keyboard access.",
        stages: [
          { title: "Submit Event and preventDefault", type: "TEXT", content: "A form fires a submit event. By default the browser navigates, or reloads the page, to submit the form. Calling preventDefault on the event stops that native submission so you can handle the data yourself with fetch or XHR.\n\nThis is how single-page apps submit forms without full page reloads." },
          { title: "Keyboard Access", type: "TEXT", content: "Keyboard users navigate with Tab and activate with Enter or Space. Listen for keydown events and check the key value; for buttons, Enter and Space provide click-like activation. Keep focus management in mind for accessibility." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Why do you preventDefault on a form submit in an SPA?", fullGoal: "Explain why preventDefault matters on a form submit in a single-page app.", expectedAnswer: "To stop native page navigation and handle submission via async logic.", rubric: "Check preventDefault understanding.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "JavaScript Core",
    order: 7,
    description: "Types, coercion, scope, functions, modules, errors.",
    phases: [
      {
        title: "Types and Coercion",
        order: 1,
        description: "Strict equality and coercion pitfalls.",
        stages: [
          { title: "Strict Equality", type: "TEXT", content: "=== compares value and type; == performs coercion. === is the default choice." },
          { title: "Coercion Pitfalls", type: "TEXT", content: "Common coercion traps, e.g., \"2\" + 2 === \"22\". Use Number() or parseInt intentionally." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What does \"2\" + 2 evaluate to and why?", expectedAnswer: "\"22\" because + with strings concatenates.", rubric: "Check coercion understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Scope and Functions",
        order: 2,
        description: "Deep scope and higher-order functions.",
        stages: [
          { title: "Scope Deep Dive", type: "TEXT", content: "Scope chains, closures intro, function scope." },
          { title: "Callbacks and Higher-Order Functions", type: "TEXT", content: "Functions as arguments; returning functions; map/filter for simple transforms." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What is a closure?", expectedAnswer: "A function that retains access to variables from its enclosing scope after that scope exits.", rubric: "Check closure concept.", points: 1 },
          ],
        },
      },
      {
        title: "Modules and Errors",
        order: 3,
        description: "ES modules and error objects.",
        stages: [
          { title: "Modules", type: "TEXT", content: "import/export syntax to split code into modules." },
          { title: "Error Objects", type: "TEXT", content: "Error instances carry message, name, stack; catch specific error types when needed." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "How do you export a function from a module?", expectedAnswer: "export function name() {} or export default.", rubric: "Check module syntax.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "Async and the Event Loop",
    order: 8,
    description: "Sync vs async, call stack, queues, promises, async/await, fetch, six data states.",
    phases: [
      {
        title: "Sync vs Async and Queues",
        order: 1,
        description: "Execution model.",
        stages: [
          { title: "Call Stack and Sync", type: "TEXT", content: "JS is single-threaded; call stack executes sync code. Async operations push tasks." },
          { title: "Task and Microtask Queues", type: "TEXT", content: "Task queue (macrotask) vs microtask queue (promises). Microtasks run before next task." },
          { title: "Event Loop", type: "TEXT", content: "Event loop waits for call stack to drain, then drains microtask queue before next task." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "After an async task resolves, when do microtasks run relative to the next task?", expectedAnswer: "Before the next task (microtasks drain first).", rubric: "Check event loop understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Promises, async/await, fetch",
        order: 2,
        description: "Async programming and network.",
        stages: [
          { title: "Promises", type: "TEXT", content: "Promise states: pending, fulfilled, rejected. then/catch/finally." },
          { title: "async/await and fetch", type: "TEXT", content: "async/await wraps promises; fetch returns a promise for HTTP requests; handle res.ok and status codes." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What does await do in async code?", expectedAnswer: "Pauses function execution until a promise settles, then continues with the value.", rubric: "Check async understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Six Data States",
        order: 3,
        description: "Loading, empty, error, offline, stale handling in UI.",
        stages: [
          { title: "Loading and Empty", type: "TEXT", content: "Loading state shows progress; empty state shows no-data messaging. Design for both." },
          { title: "Error and Stale", type: "TEXT", content: "Error state with plain-language message + retry; stale state with last-updated time. Offline state with retry." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "In a data view, what is the difference between error and stale?", expectedAnswer: "Error = fetch failed; stale = data exists but is outdated (last-updated time).", rubric: "Check state design understanding.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "State",
    order: 9,
    description: "State vs prop vs derived; immutability; one-way flow.",
    phases: [
      {
        title: "State vs Prop vs Derived",
        order: 1,
        description: "Core state model concepts.",
        stages: [
          { title: "Definitions", type: "TEXT", content: "State is internal mutable data; props are inputs from parent; derived can be computed. Know the distinction." },
          { title: "When to Lift", type: "TEXT", content: "Lift state up when sibling components need shared state; keep local when not." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "In React, is state mutable or immutable?", expectedAnswer: "Immutable (state updates create new objects/arrays).", rubric: "Check immutability understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Immutability and One-Way Flow",
        order: 2,
        description: "Mutation pitfalls and data flow.",
        stages: [
          { title: "Mutation vs New", type: "TEXT", content: "Mutating state directly causes stale UI bugs; always create new objects/arrays when updating state." },
          { title: "Two-Copies Bug", type: "TEXT", content: "Mutating a nested object that was spread into state creates two copies with divergent values; leads to stale UI." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What causes the 'two-copies' bug in React state?", expectedAnswer: "Direct mutation of a nested object that was previously copied into state.", rubric: "Check immutability understanding.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "React Basics",
    order: 10,
    description: "Vite, JSX, components, props, state, lists, keys, forms, effects, lifting, custom hooks, mini-app.",
    phases: [
      {
        title: "Vite, JSX, Component",
        order: 1,
        description: "React foundation.",
        stages: [
          { title: "Vite and JSX", type: "TEXT", content: "Vite scaffolds React fast. JSX compiles to React.createElement; class becomes className." },
          { title: "First Component", type: "TEXT", content: "Function component returning JSX. Know JSX = JavaScript syntax extension." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "In JSX, how do you write the HTML class attribute?", expectedAnswer: "className.", rubric: "Check JSX knowledge.", points: 1 },
          ],
        },
      },
      {
        title: "Props",
        order: 2,
        description: "Passing data into components.",
        stages: [
          { title: "Props Passing", type: "TEXT", content: "Props flow parent → child; props are read-only inputs." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Are props mutable in React?", expectedAnswer: "No; props are immutable inputs from parent.", rubric: "Check props understanding.", points: 1 },
          ],
        },
      },
      {
        title: "State and Lists",
        order: 3,
        description: "useState, lists, keys, conditional rendering.",
        stages: [
          { title: "useState", type: "TEXT", content: "useState hook adds state; setState updates immutably." },
          { title: "Lists and Keys", type: "TEXT", content: "Render lists from arrays; keys stable and unique; conditional rendering with ternary or &&." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Why do lists need stable keys in React?", expectedAnswer: "Keys help reconciliation match items across renders; unstable keys cause bugs.", rubric: "Check keys understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Events, Forms, useEffect",
        order: 4,
        description: "Event handlers, controlled forms, effects.",
        stages: [
          { title: "Events via Props", type: "TEXT", content: "Pass handler functions via props; onClick etc. in React.", },
          { title: "Controlled Forms", type: "TEXT", content: "Controlled inputs: value + onChange in state. Controlled = single source of truth." },
          { title: "useEffect", type: "TEXT", content: "useEffect runs side effects (fetch, subscriptions); dependency array controls when." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What is a controlled input in React?", expectedAnswer: "Input value comes from state and changes update state via onChange.", rubric: "Check controlled component understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Lifting State, Custom Hooks, Mini App",
        order: 5,
        description: "Compose components; build mini app.",
        stages: [
          { title: "Lifting State", type: "TEXT", content: "Lift state to closest common ancestor; pass down via props with callbacks." },
          { title: "Custom Hooks", type: "TEXT", content: "Extract reusable stateful logic into custom hooks using useState/useEffect." },
          { title: "Mini Capstone App", type: "TEXT", content: "Build a small interactive app: counter or list with state, derived values, effects, forms." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "When should you lift state up in React?", expectedAnswer: "When sibling or child components need shared state.", rubric: "Check lifting understanding.", points: 1 },
          ],
        },
      },
    ],
  },
  {
    title: "Shipping It",
    order: 11,
    description: "Git workflow, deploy, accessibility, performance, capstone brief, what's next.",
    phases: [
      {
        title: "Git Workflow",
        order: 1,
        description: "Branch, commit, push, PR basics.",
        stages: [
          { title: "Git Basics", type: "TEXT", content: "init/add/commit/status; branch, push, pull request workflow for shipping." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What does git add . do?", expectedAnswer: "Stages all changes for the next commit.", rubric: "Check git basics.", points: 1 },
          ],
        },
      },
      {
        title: "Deploy",
        order: 2,
        description: "Static deploy via zero-cost host (Vercel/GitHub Pages).",
        stages: [
          { title: "Static Deploy Setup", type: "TEXT", content: "Configure static build output (Vite static) and deploy to Vercel or GitHub Pages at zero cost." },
          { title: "Deploy the Mini App", type: "TEXT", content: "Deploy the React mini app to staging/production URL; verify it loads." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "What is typically required to deploy a Vite static app?", expectedAnswer: "Build command output dist, host serving static files.", rubric: "Check deploy understanding.", points: 1 },
          ],
        },
      },
      {
        title: "Accessibility, Performance, Capstone Brief, What's Next",
        order: 3,
        description: "Final polish and next steps.",
        stages: [
          { title: "Accessibility Checklist", type: "TEXT", content: "Semantic HTML, labels, keyboard nav, contrast, focus order. WCAG basics." },
          { title: "Performance", type: "TEXT", content: "Core web vitals basics; reduce blocking; lazy load; optimize images." },
          { title: "Capstone Brief and Next Steps", type: "TEXT", content: "Wrap: what the learner built; what's next (routing, state management, API integration, testing)." },
        ],
        quiz: {
          passThreshold: 70,
          questions: [
            { type: "TEXT", prompt: "Name one accessibility improvement for a page with an image missing alt text.", expectedAnswer: "Add meaningful alt text.", rubric: "Check a11y understanding.", points: 1 },
          ],
        },
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding frontend course content...");

  const tutor = await db.user.upsert({
    where: { email: "tutor@netsensei.local" },
    update: {},
    create: { email: "tutor@netsensei.local", passwordHash: await hashPassword("tutor123"), role: "TUTOR" },
  });

  const student = await db.user.upsert({
    where: { email: "student@netsensei.local" },
    update: {},
    create: { email: "student@netsensei.local", passwordHash: await hashPassword("student123"), role: "STUDENT" },
  });

  const course = await db.course.upsert({
    where: { id: "course-frontend-v1" },
    update: {},
    create: {
      id: "course-frontend-v1",
      title: "Frontend Development",
      description: "Learn HTML, CSS, JavaScript, and React from scratch. Build real projects and get AI-powered feedback on your code.",
      order: 1,
      isPublished: true,
    },
  });

  // Delete existing modules/phases for clean re-seed
  const existingModules = await db.module.findMany({ where: { courseId: course.id } });
  for (const m of existingModules) {
    const phases = await db.phase.findMany({ where: { moduleId: m.id } });
    for (const p of phases) {
      await db.answerRecord.deleteMany({ where: { question: { quiz: { phaseId: p.id } } } });
      await db.snippetAttempt.deleteMany({ where: { question: { quiz: { phaseId: p.id } } } });
      await db.question.deleteMany({ where: { quiz: { phaseId: p.id } } });
      await db.quiz.deleteMany({ where: { phaseId: p.id } });
      await db.stage.deleteMany({ where: { phaseId: p.id } });
      await db.progressRecord.deleteMany({ where: { phaseId: p.id } });
      await db.phase.delete({ where: { id: p.id } });
    }
    await db.module.delete({ where: { id: m.id } });
  }

  for (const mod of modules) {
    const module = await db.module.create({
      data: { courseId: course.id, title: mod.title, order: mod.order, description: mod.description },
    });

    for (const phase of mod.phases) {
      const createdPhase = await db.phase.create({
        data: { moduleId: module.id, title: phase.title, order: phase.order, description: phase.description },
      });

      for (const [idx, stage] of phase.stages.entries()) {
        await db.stage.create({
          data: {
            phaseId: createdPhase.id,
            title: stage.title,
            type: stage.type,
            content: stage.content,
            order: idx + 1,
            imageUrl: stage.type === "IMAGE" ? "/uploads/placeholder.svg" : null,
          },
        });
      }

      if (phase.quiz) {
        const quiz = await db.quiz.create({
          data: {
            phaseId: createdPhase.id,
            mode: "NORMAL",
            passThreshold: phase.quiz.passThreshold ?? 70,
          },
        });

        for (const q of phase.quiz.questions) {
          await db.question.create({
            data: {
              quizId: quiz.id,
              type: q.type,
              prompt: q.prompt,
              fullGoal: q.fullGoal ?? null,
              expectedAnswer: q.expectedAnswer ?? null,
              rubric: q.rubric ?? null,
              order: (q.points ?? 1),
              points: q.points ?? 1,
            },
          });
        }
      }
    }
  }

  console.log("✅ Frontend course content seeded");
  console.log(`   Tutor:    ${tutor.email} / tutor123`);
  console.log(`   Student:  ${student.email} / student123`);
  console.log(`   Modules:  ${modules.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
