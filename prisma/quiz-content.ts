/**
 * Answer-key content for every quiz question.
 *
 * - `options` + `correctIndex` turn a question into multiple choice.
 * - `explanation` is shown to the student after they submit, and to tutors in
 *   the solutions view.
 *
 * Distractor rules used here (distractor research): every wrong option is a
 * real misconception from the course, roughly the same length as the correct
 * answer, and never a giveaway ("all of the above", "none of the above").
 *
 * Questions left without `options` stay open-ended, because producing the
 * answer is the learning goal for those (diagnostic sequences, rationales,
 * and code).
 */
export type QuestionContent = {
  options?: string[];
  correctIndex?: number;
  explanation: string;
};

export const questionContent: Record<string, QuestionContent> = {
  /* ── Orientation: The Workshop ─────────────────────────────────────── */
  "What are the four panes of the workshop, and what does each one do?": {
    options: [
      "The editor writes code, the browser renders the page, the terminal runs the server and commands, and the run loop connects edit, save, and refresh.",
      "The editor runs the server, the browser writes the code, the terminal renders the page, and the run loop decides which file to open.",
      "The editor renders the page, the browser types commands, the terminal edits files, and the run loop compiles your code.",
      "The editor writes code, the browser edits files, the terminal draws the interface, and the run loop caches your assets.",
    ],
    correctIndex: 0,
    explanation:
      "Each pane has one job: the editor writes files, the terminal runs processes and commands, the browser renders the result, and the run loop is the edit-save-refresh cycle that ties them together.",
  },
  "A saved style change is not showing up. Name three things you check, in order.": {
    explanation:
      "A good debugging order is: confirm the file was saved and is the right file, confirm the URL and port you are viewing, then bypass the cache with a hard reload or DevTools Disable cache. Checking in that order rules out the most common causes first.",
  },
  "What is an origin, and why does it matter?": {
    options: [
      "Scheme plus host plus port; it defines the boundary for cookies, storage, and cross-origin requests.",
      "The URL path plus query string; it decides which server handles the request.",
      "The domain name alone; it decides which cookies a page may read.",
      "The file system root that serves the page; it defines where relative paths resolve.",
    ],
    correctIndex: 0,
    explanation:
      "An origin is scheme + host + port. Two URLs share an origin only if all three match, and the browser uses that boundary to decide whether cookies, storage, and fetch requests are allowed.",
  },

  /* ── Orientation: First Page and Run It ────────────────────────────── */
  "What are the four parts of an HTML document, and what belongs in each?": {
    options: [
      "Doctype for standards mode, html as the root carrying lang, head for metadata and links, body for visible content.",
      "Doctype for the page title, html for stylesheets, head for the visible text, body for the viewport meta tag.",
      "html for metadata, head for the page body, body for the doctype, doctype for character encoding.",
      "Doctype for the visible content, html for links, head for the root element, body for the language attribute.",
    ],
    correctIndex: 0,
    explanation:
      "The doctype selects standards mode, html is the root element that carries lang, head holds metadata the user does not see, and body holds everything that renders.",
  },
  "A stylesheet link returns 404. What do you compare first?": {
    options: [
      "The resolved request URL in the Network panel against the actual file path on disk.",
      "The CSS rules in the file against the styles it is supposed to apply.",
      "The file extension against the MIME type the server expects.",
      "The link element's media attribute against the browser window size.",
    ],
    correctIndex: 0,
    explanation:
      "A 404 is a path problem, not a CSS problem. Compare the URL the browser actually requested with the real path of the file: remember that relative paths resolve against the document URL, that case matters on Linux servers, and that a leading slash means the server root.",
  },
  "Why does View Source differ from the Elements panel after a script runs?": {
    options: [
      "View Source shows the delivered HTML; Elements shows the parsed and possibly script-modified DOM.",
      "View Source shows the CSSOM; Elements shows the render tree.",
      "View Source shows the live DOM; Elements shows the original file on disk.",
      "View Source is cached by the browser; Elements is always fetched fresh.",
    ],
    correctIndex: 0,
    explanation:
      "View Source is the bytes the server sent. The Elements panel is what the parser and your scripts produced from those bytes. Editing in Elements is temporary because the file on disk never changed.",
  },

  /* ── Orientation: Reading Tools ────────────────────────────────────── */
  "Which DevTools panel shows the live DOM and applied styles?": {
    options: [
      "The Elements panel.",
      "The Sources panel.",
      "The Network panel.",
      "The Application panel.",
    ],
    correctIndex: 0,
    explanation:
      "Elements shows the live DOM tree and the CSS rules that won the cascade, including crossed-out declarations. Sources holds your files and the debugger; Network lists requests; Application holds storage.",
  },
  "In an error stack trace, where do you start reading?": {
    options: [
      "At the first frame that belongs to your own code, then follow the call chain outward.",
      "At the topmost frame, because that is where the error was thrown.",
      "At the last frame, because it names the failing function.",
      "At the first line that mentions a library, because libraries fail first.",
    ],
    correctIndex: 0,
    explanation:
      "Library and browser frames sit above your own code. Find the first frame in your code: that is usually where the assumption broke, and reading downward tells you how it got there.",
  },
  "What is the difference between the working tree, the staging area, and the repository?": {
    options: [
      "Working tree is the current files; staging is what the next commit includes; the repository is committed history.",
      "Working tree is committed history; staging is the current files; the repository is a temporary snapshot.",
      "Working tree and staging are the same thing; the repository is the remote copy on the server.",
      "Working tree is what you edit; the repository is a scratch area that the next commit clears.",
    ],
    correctIndex: 0,
    explanation:
      "Three places, three jobs: you edit in the working tree, `git add` moves changes into the staging area, and `git commit` writes them into the repository as permanent history.",
  },

  /* ── The Wire ──────────────────────────────────────────────────────── */
  "What does DNS do, and where is the answer cached?": {
    options: [
      "It maps a hostname to an IP address; answers cache in the browser, OS, and recursive resolver for the record's TTL.",
      "It encrypts the connection; answers cache only in the browser's history.",
      "It loads the page's resources; answers cache in the Network panel.",
      "It resolves a path to a file; answers cache on the web server.",
    ],
    correctIndex: 0,
    explanation:
      "DNS is the phone book: name to IP address. Answers are cached at several layers — browser, operating system, and recursive resolver — for the record's TTL, which is why the first visit is slower.",
  },
  "What is the difference between TCP and TLS?": {
    options: [
      "TCP provides a reliable ordered connection; TLS runs over it to encrypt and authenticate the conversation.",
      "TCP encrypts the connection; TLS guarantees the packets arrive in order.",
      "TCP is used for HTTPS; TLS is used for plain HTTP.",
      "They are two names for the same protocol at different layers of the browser.",
    ],
    correctIndex: 0,
    explanation:
      "TCP is transport: connection, ordering, retransmission. TLS is security: encryption plus certificate authentication, layered on top of TCP. HTTPS is HTTP running over TLS over TCP.",
  },
  "Which parts of a URL are sent to the server, and which are not?": {
    options: [
      "Scheme, host, port, path, and query reach the server; the fragment stays in the browser.",
      "Only the path and query reach the server; everything else stays in the browser.",
      "Everything except the query string reaches the server.",
      "Only the host and port reach the server; the path is resolved by the browser.",
    ],
    correctIndex: 0,
    explanation:
      "The fragment after `#` never leaves the browser — it is used by the client to scroll or drive a single-page route. Everything before it is part of the request.",
  },
  "Which response header tells the browser how to interpret the body?": {
    options: [
      "Content-Type, for example text/html or application/json.",
      "Content-Length, for example 1024 bytes.",
      "Cache-Control, for example max-age=60.",
      "Access-Control-Allow-Origin, for example https://example.com.",
    ],
    correctIndex: 0,
    explanation:
      "Content-Type tells the browser how to parse the body. Get it wrong and a stylesheet is ignored or an image refuses to render, while the status code still reads 200.",
  },

  /* ── Critical Rendering Path ───────────────────────────────────────── */
  "What is TTFB, and what does a slow TTFB tell you?": {
    options: [
      "Time from request to the first response byte; a slow value points at server processing or network latency, not parsing.",
      "Time spent parsing HTML into the DOM; a slow value points at a large document.",
      "Time spent downloading every asset on the page.",
      "Time between the user clicking and the browser sending the request.",
    ],
    correctIndex: 0,
    explanation:
      "TTFB covers the request and the server's first byte. If TTFB is slow the problem is upstream of the browser's rendering work — the server or the network, not your HTML.",
  },
  "What is the difference between layout and paint?": {
    options: [
      "Layout computes positions and sizes; paint rasterizes the visual result into pixels and layers.",
      "Layout rasterizes pixels; paint computes positions and sizes.",
      "Layout runs on the GPU; paint runs on the CPU.",
      "They are two names for the same stage described from different panels.",
    ],
    correctIndex: 0,
    explanation:
      "Layout is geometry: every box gets a position and a size. Paint turns that geometry into drawing commands and rasterizes them. Composite then assembles the layers.",
  },
  "Why does a stylesheet in the head block first paint?": {
    options: [
      "The browser needs the CSSOM to build the render tree and avoid a flash of unstyled content.",
      "Stylesheets are large files, so the browser waits for the whole file before parsing HTML.",
      "The parser stops at any link element until the CSS has been applied to the DOM.",
      "The browser refuses to paint until every image on the page has loaded.",
    ],
    correctIndex: 0,
    explanation:
      "No CSSOM, no render tree, no paint. Blocking is intentional — painting early would show unstyled text. `media` queries that exclude the current medium, or non-blocking patterns, remove the block.",
  },

  /* ── DevTools Network Panel ────────────────────────────────────────── */
  "A request shows a long waiting bar and a short download bar. Where is the bottleneck?": {
    options: [
      "Server processing or network latency before the first byte, not payload size.",
      "The payload is too large for the connection.",
      "The browser is spending time parsing the response body.",
      "The request was served from cache and had to be revalidated.",
    ],
    correctIndex: 0,
    explanation:
      "The waiting bar is time until the first byte: the server was thinking or the network was slow. A short download bar means the payload was small, so size is not your problem.",
  },
  "What does a 304 response mean, and why is it useful?": {
    options: [
      "Not modified: the cached copy is still valid, so the browser reuses it and saves bandwidth.",
      "Redirect: the browser should fetch the resource from a different URL.",
      "Partial content: only the first part of the file was sent.",
      "Unauthorized: the cached copy has expired and needs fresh credentials.",
    ],
    correctIndex: 0,
    explanation:
      "304 is conditional caching working: the client sent an ETag or Last-Modified, the server said the copy is still good, and no body was transferred.",
  },
  "The Network panel shows a 200 but JavaScript reports a CORS error. Why?": {
    options: [
      "The server responded, but the browser blocked access because the response lacked a permitted Access-Control-Allow-Origin for that origin.",
      "The server returned a 200 with an empty body, so the JSON parse failed.",
      "The request was a preflight and the browser rejected it before sending.",
      "The response was cached without CORS headers from an earlier visit.",
    ],
    correctIndex: 0,
    explanation:
      "CORS is enforced by the browser, not the server. The request succeeded on the wire (that is your 200), then the browser refused to hand the response to JavaScript because the origin was not allowed.",
  },

  /* ── DOM, CSSOM, Render Tree ───────────────────────────────────────── */
  "What is the difference between the DOM and the render tree?": {
    options: [
      "The DOM is the document structure; the render tree contains only painted nodes with computed styles applied.",
      "The DOM includes styling; the render tree contains only the document structure.",
      "They contain the same nodes, but the render tree is the one JavaScript can query.",
      "The DOM is built by CSS; the render tree is built by the HTML parser.",
    ],
    correctIndex: 0,
    explanation:
      "The DOM is every node the parser created, including hidden ones. The render tree is the subset that will be painted, with computed styles attached — and it is not queryable from JavaScript.",
  },
  "How do display: none and visibility: hidden differ in the render tree?": {
    options: [
      "display: none removes the node and subtree from layout and the render tree; visibility: hidden keeps the box in layout but paints nothing.",
      "Both remove the node from the render tree; only display: none also removes the layout space.",
      "display: none keeps the box in layout; visibility: hidden removes it from layout and paint.",
      "There is no difference — both hide the element in the same way.",
    ],
    correctIndex: 0,
    explanation:
      "Choose by whether the space should remain. `display: none` collapses the box entirely; `visibility: hidden` keeps its size and position but paints nothing.",
  },
  "Why can getBoundingClientRect return zeros for a display: none element?": {
    options: [
      "The element has no box in the render tree, so there is no geometry to measure.",
      "The browser hides the numbers until the element becomes visible.",
      "The element is animated and the measurement caught it mid-transition.",
      "The element is inside an iframe and cannot be measured from the parent.",
    ],
    correctIndex: 0,
    explanation:
      "A `display: none` element is not in the render tree, so it has no box and therefore no geometry. Zero width and height is a useful diagnostic, not a bug.",
  },

  /* ── Layout, Paint, Composite, Frame Budget ────────────────────────── */
  "Why does animating transform instead of top/left help meet the frame budget?": {
    options: [
      "Transform changes can be handled by the compositor without layout or paint; top and left trigger layout.",
      "Transform is a newer property that browsers always run on the GPU.",
      "top and left are ignored on elements that have a position value.",
      "Transform animations are shorter, so the browser has less work to finish.",
    ],
    correctIndex: 0,
    explanation:
      "Changing `top`/`left` changes geometry, so layout must run, then paint, then composite. A transform can skip straight to the compositor, which is why it is the animation property to reach for.",
  },
  "What is layout thrashing, and how do you avoid it?": {
    explanation:
      "Thrashing is interleaving layout reads (offsetWidth, getBoundingClientRect) with writes (style changes). Each read after a write forces a synchronous reflow. Read everything first, then write everything — or better, change a class and let CSS own the values.",
  },
  "What is a long task, and why does it matter?": {
    options: [
      "A task over 50ms; it can block rendering and input long enough to drop frames and feel janky.",
      "A task over 5 seconds; anything shorter is invisible to the user.",
      "Any task that runs in a Web Worker.",
      "A network request that takes more than 50ms.",
    ],
    correctIndex: 0,
    explanation:
      "The 50ms threshold is where a task can no longer fit comfortably in a frame. A single long task during a scroll or keypress is enough for the user to feel jank.",
  },

  /* ── Blocking and First Paint ──────────────────────────────────────── */
  "What makes a page render-blocking before first paint?": {
    options: [
      "Stylesheets in the head and synchronous scripts block rendering until they are fetched and processed.",
      "Any stylesheet anywhere in the document, unless it is loaded with async.",
      "Only scripts block rendering; stylesheets never delay the first paint.",
      "Images larger than the viewport block rendering until they finish decoding.",
    ],
    correctIndex: 0,
    explanation:
      "Head stylesheets block because the CSSOM is required to build the render tree, and synchronous scripts block because the parser stops to execute them. `defer`, `async`, and `media` queries remove the block.",
  },
  "What is the difference between defer and async?": {
    options: [
      "defer executes after parsing in document order; async executes as soon as it loads, with no order guarantee.",
      "defer blocks the parser; async lets the parser continue immediately.",
      "async preserves execution order; defer executes in reverse order.",
      "There is no difference in modern browsers; the attribute is only a hint.",
    ],
    correctIndex: 0,
    explanation:
      "`defer` downloads in parallel but runs after parsing, in document order — the safe default for application code. `async` runs whenever it arrives, so only use it for independent scripts.",
  },
  "Which Core Web Vital measures loading, and what event marks it?": {
    options: [
      "LCP, Largest Contentful Paint, marks the render time of the largest visible content element.",
      "CLS, Cumulative Layout Shift, marks the moment the page layout settles.",
      "INP, Interaction to Next Paint, marks the delay before the first click responds.",
      "FCP, First Contentful Paint, marks when the largest element finishes loading.",
    ],
    correctIndex: 0,
    explanation:
      "LCP is the loading vital: the render time of the largest visible element. CLS measures visual stability, INP measures responsiveness, and FCP is an earlier paint signal.",
  },

  /* ── CSS: Selectors and the Cascade ────────────────────────────────── */
  "What are the three parts of a CSS rule, and which one decides where the rule applies?": {
    options: [
      "A selector, a declaration block, and declarations made of property and value pairs. The selector decides which elements match.",
      "A property, a value, and a selector. The property decides which elements match.",
      "A declaration block, a property, and a semicolon. The semicolon decides which elements match.",
      "A selector, a value, and a comment. The value decides which elements match.",
    ],
    correctIndex: 0,
    explanation:
      "A rule is selector + declaration block, and the block holds property/value pairs. The selector is the part that says where the rule applies; the property and value say what it does.",
  },
  "Why is a class usually a better styling hook than an ID?": {
    explanation:
      "Classes are reusable across many elements, can be combined on one element, and keep specificity low so later rules can override them. IDs are unique and create specificity so high that overriding them usually needs `!important`.",
  },
  "Rank these from weakest to strongest: .card, inline style, #hero .card, .card.featured.": {
    options: [
      ".card, then .card.featured, then #hero .card, then the inline style.",
      ".card, then #hero .card, then .card.featured, then the inline style.",
      ".card.featured, then .card, then #hero .card, then the inline style.",
      ".card, then .card.featured, then the inline style, then #hero .card.",
    ],
    correctIndex: 0,
    explanation:
      "Specificity: type < class < id < inline. `.card` is (0,1,0), `.card.featured` is (0,2,0), `#hero .card` is (1,1,0), and an inline style always wins.",
  },
  "What does :where() contribute to specificity, and when is that useful?": {
    options: [
      ":where() contributes zero specificity, which makes it useful for resets and default styles that should be easy to override.",
      ":where() contributes the specificity of its most specific argument, like :is() does.",
      ":where() adds one class to the specificity, making defaults harder to override.",
      ":where() removes the element from the cascade entirely, so no rule can target it.",
    ],
    correctIndex: 0,
    explanation:
      "`:where()` always scores zero. That is what makes it ideal for resets and base styles: any later class rule beats it without `!important`.",
  },
  "Write a rule that gives every element with the class card 16px of padding and a 1px solid border.": {
    explanation:
      "A correct answer is `.card { padding: 16px; border: 1px solid #d6d6d6; }`. The class selector targets every element with that class, the two declarations set the padding and the 1px solid border, and the value uses a hex colour for the border.",
  },

  /* ── CSS: The Box Model ────────────────────────────────────────────── */
  "Name the four layers of the CSS box model from the inside out.": {
    options: [
      "Content, padding, border, and margin.",
      "Margin, border, padding, and content.",
      "Padding, content, margin, and border.",
      "Content, margin, border, and padding.",
    ],
    correctIndex: 0,
    explanation:
      "From the inside out: content holds the text or children, padding surrounds the content inside the border, the border draws the edge, and margin is the empty space outside it.",
  },
  "What does box-sizing: border-box change about width?": {
    options: [
      "The declared width includes padding and border, so the content box shrinks instead of the element growing.",
      "The declared width is ignored and the element sizes to its content.",
      "Margin is added to the declared width instead of padding and border.",
      "Height is affected the same way, but width is still the content box only.",
    ],
    correctIndex: 0,
    explanation:
      "By default `width` is the content box, so adding padding and a border makes the element wider than the number you wrote. With `border-box` the declared width is the total, and the content area shrinks instead.",
  },
  "When does an element use block layout versus inline layout?": {
    options: [
      "A block box starts on a new line and accepts width and height, while an inline box flows inside text and ignores width and height.",
      "Block layout is for elements inside a flex container; inline layout is for everything else.",
      "Inline elements stack vertically; block elements sit side by side.",
      "The browser chooses automatically, based on whether the element has children.",
    ],
    correctIndex: 0,
    explanation:
      "`display` decides the layout model. A block box breaks the line and takes width, height, and vertical margins. An inline box flows inside the text and ignores width and height.",
  },
  "A flex item refuses to shrink and overflows its row. What property fixes it, and why?": {
    explanation:
      "Set `min-width: 0` on the item. Flex items default to `min-width: auto`, which resolves to the content's minimum size, so a long word or wide image refuses to shrink below its content. `min-width: 0` lets the item shrink and makes `text-overflow: ellipsis` work.",
  },
  "Make .card keep its declared width even after padding and a border are added.": {
    explanation:
      "A correct answer is `.card { box-sizing: border-box; }`. With `border-box` the declared width includes padding and border, so the element keeps the width you wrote.",
  },

  /* ── CSS: Type, Color, and Spacing ─────────────────────────────────── */
  "Why use a font stack instead of a single font name?": {
    options: [
      "The stack lists fallbacks so text still renders when a font is missing, ending with a generic family such as sans-serif.",
      "A stack lets the browser pick the first font that loads fastest.",
      "Font stacks are required for variable fonts to work.",
      "A single font name is invalid CSS unless it is quoted.",
    ],
    correctIndex: 0,
    explanation:
      "The browser walks the list and uses the first available family, ending at a generic family that always resolves. That is why text never renders in the fallback default.",
  },
  "What is the difference between rem and px for font sizes?": {
    options: [
      "rem is relative to the root font size and respects user settings, while px is fixed.",
      "rem is relative to the parent element; px is relative to the root element.",
      "They are interchangeable, and browsers convert px to rem automatically.",
      "px scales with the user's zoom settings, while rem does not.",
    ],
    correctIndex: 0,
    explanation:
      "`rem` is relative to the root font size, so it follows the user's browser preference. `px` is an absolute unit that ignores that preference — which is exactly why rem-based type is the accessible default.",
  },
  "What contrast ratio should body text reach against its background?": {
    options: [
      "At least 4.5 to 1 for normal text, and 3 to 1 for large text.",
      "At least 3 to 1 for normal text, and 4.5 to 1 for large text.",
      "At least 7 to 1 for all text, regardless of size.",
      "There is no fixed ratio; what matters is that it looks different enough.",
    ],
    correctIndex: 0,
    explanation:
      "WCAG AA requires 4.5:1 for normal text and 3:1 for large text (18pt, or 14pt bold). Placeholder text, disabled states, and thin borders are the usual failures.",
  },
  "Why prefer :focus-visible over removing the focus outline?": {
    explanation:
      "`:focus-visible` draws a ring for keyboard navigation and stays quiet for mouse clicks, so nothing is lost for keyboard users. Removing the outline entirely makes it impossible to tell where focus is, which breaks keyboard navigation.",
  },
  "Why use a spacing scale instead of arbitrary pixel values?": {
    explanation:
      "A scale keeps spacing consistent and repeatable. Two values that are almost the same (13px and 27px) read as an accident rather than a decision, and every new value has to be re-checked against every other one.",
  },
  "Define an accent color custom property on :root and use it as the background of .button.": {
    explanation:
      "A correct answer is `:root { --accent: #2563eb; } .button { background: var(--accent); }`. The property is declared on `:root` so it inherits everywhere, and `var(--accent)` consumes it in the background.",
  },

  /* ── JavaScript Survival Kit: Values and Types ─────────────────────── */
  "What does typeof null return, and how do you check for null correctly?": {
    options: [
      "'object' — it is a legacy bug, so compare with value === null instead.",
      "'null' — typeof reports null values directly.",
      "'undefined' — an unset value and null are reported the same way.",
      "'object' — you must use typeof to test for null, because === never matches it.",
    ],
    correctIndex: 0,
    explanation:
      "`typeof null` returns 'object' because of a bug from the first days of JavaScript that could never be fixed without breaking old sites. That makes typeof useless for detecting null, and `value === null` the correct check.",
  },
  "What is the difference between const and let?": {
    options: [
      "Both are block-scoped; const forbids reassigning the binding, while let allows it. const does not freeze objects.",
      "const is function-scoped while let is block-scoped, and const makes its value immutable.",
      "let creates a constant binding and const creates a variable that can be changed.",
      "const freezes the object it points to, so its properties cannot change; let only rebinds the name.",
    ],
    correctIndex: 0,
    explanation:
      "const protects the binding, not the value. `const user = { name: 'Ada' }` still allows `user.name = 'Grace'`. Freezing an object is a separate, explicit choice with Object.freeze.",
  },
  "Why is Number('') a risky conversion for a form field?": {
    options: [
      "It returns 0, so an empty field silently becomes zero; trim and validate before converting.",
      "It returns NaN, so every empty field throws when you do arithmetic on it.",
      "It returns the string's character length, which is 0 for any empty string.",
      "It trims whitespace and returns 0 for blank input, but returns NaN for text.",
    ],
    correctIndex: 0,
    explanation:
      "`Number('')` is 0, so an empty input quietly becomes zero and slips through a 'must be greater than zero' check. Validate the raw string first, then convert it.",
  },
  "Name the falsy values in JavaScript.": {
    options: [
      "false, 0, -0, 0n, '', null, undefined, and NaN.",
      "false, 0, '', null, and undefined only; the rest are truthy.",
      "false, 0, '', null, undefined, and empty arrays and objects.",
      "Only false, null, undefined, 0, and '' are falsy; NaN and -0 are truthy.",
    ],
    correctIndex: 0,
    explanation:
      "There are exactly eight falsy values. The two that surprise people are NaN, which is not equal to itself, and 0n, the BigInt zero. Note that [] and {} are truthy, so an empty array passes an `if` check.",
  },

  /* ── JavaScript Survival Kit: Functions and Control Flow ────────────── */
  "Write a function that takes a number and returns true when the number is even.": {
    explanation:
      "A correct answer is `function isEven(n) { return n % 2 === 0; }`. The remainder operator % gives 0 for even numbers, and the strict comparison returns a real boolean rather than a number.",
  },
  "What does an arrow function with braces but no return statement return?": {
    options: [
      "undefined; braces require an explicit return, unlike a single-expression body.",
      "The value of the last statement in the block, like a normal function body.",
      "null, because a block with no return produces an empty value.",
      "The function itself, since a braced body is treated as a class constructor.",
    ],
    correctIndex: 0,
    explanation:
      "A single-expression arrow body returns that expression: `const double = (n) => n * 2`. With braces you are writing a normal function body, and a function with no return statement returns undefined.",
  },
  "Why is if (items) a poor guard for an array that may be empty?": {
    options: [
      "An empty array is truthy, so the branch runs; check items.length > 0 instead.",
      "An empty array is falsy in JavaScript, so the branch never runs.",
      "Arrays have no truthiness, so if (items) throws a TypeError.",
      "The branch always runs because arrays are objects and objects are always truthy.",
    ],
    correctIndex: 0,
    explanation:
      "Only eight values are falsy, and [] is not one of them. An empty array is truthy, so the guard passes and your code runs on nothing. Check the length instead.",
  },
  "Why does a switch case need break or return?": {
    options: [
      "Without break or return, execution falls through into the following cases; that is occasionally useful but usually a bug.",
      "Without break or return, the case block is skipped entirely and the default runs.",
      "break is only needed in loops; inside a switch each case is already isolated.",
      "Without break or return, JavaScript throws a SyntaxError at parse time.",
    ],
    correctIndex: 0,
    explanation:
      "switch creates no implicit boundary between cases. Each case runs until something exits it: break, return, or throw. Fallthrough can be deliberate when a case has no statements of its own, but it is usually an accident.",
  },

  /* ── JavaScript Survival Kit: Objects and Arrays ───────────────────── */
  "Given const names = ['Ada', 'Grace', 'Linus']; what does names.forEach do?": {
    options: [
      "Runs the callback once per element in order, passing the element, index, and array; it returns undefined.",
      "Returns a new array with the callback's return value for each element.",
      "Runs the callback once per element but skips empty strings and null entries.",
      "Returns a new array of the elements the callback changed to true.",
    ],
    correctIndex: 0,
    explanation:
      "forEach is for side effects, not transformation: it always returns undefined, so you cannot assign its result. Use map when you want a new array and filter when you want a subset.",
  },
  "What is the difference between map and filter?": {
    options: [
      "map transforms every element into a new array of the same length; filter selects a subset and may return fewer elements.",
      "map returns a new array and leaves the original untouched; filter mutates the original array in place.",
      "map filters by a predicate; filter maps each element through a transform function.",
      "They are aliases for the same operation and behave identically on arrays.",
    ],
    correctIndex: 0,
    explanation:
      "map is one-in, one-out, so its result always has the same length as the input. filter keeps or drops each element, so its result can be shorter. Neither mutates the original array.",
  },
  "How do you turn an object into an array of key-value pairs?": {
    options: [
      "Object.entries(object).",
      "Object.keys(object), which returns the pairs for each key.",
      "Array.from(object), which iterates the values in key order.",
      "object.map((key, value) => [key, value]), since objects support map.",
    ],
    correctIndex: 0,
    explanation:
      "`Object.entries` returns an array of [key, value] pairs. Object.keys returns just the keys, Object.values just the values, and plain objects have no map method — arrays do.",
  },
  "Use map to turn an array of numbers into an array of their squares.": {
    explanation:
      "A correct answer is `numbers.map((n) => n * n)`. map calls the callback once per element and returns a new array holding each result, leaving the original array untouched.",
  },

  /* ── JavaScript Survival Kit: Scope and Hoisting ────────────────────── */
  "What error do you get if you read a let variable before its declaration line has executed?": {
    options: [
      "ReferenceError, because let and const are hoisted but uninitialized until the declaration runs.",
      "TypeError, because the variable holds no type until it is assigned.",
      "undefined, because let is hoisted without a value like var.",
      "No error — the variable exists but is empty until the declaration runs.",
    ],
    correctIndex: 0,
    explanation:
      "let and const are hoisted to the top of their block but stay uninitialized. That gap is the temporal dead zone, and touching the name inside it throws a ReferenceError. var is hoisted and initialized to undefined instead.",
  },
  "How does var scoping differ from let and const?": {
    options: [
      "var is function-scoped and leaks out of blocks; let and const are block-scoped.",
      "var is block-scoped like let and const, but it can be redeclared in the same scope.",
      "var is global-scoped and always attaches to window; let and const are function-scoped.",
      "There is no difference in scope; the only difference is that var can be reassigned.",
    ],
    correctIndex: 0,
    explanation:
      "A var declared inside an if block or a for loop is still visible after the block ends, because var is scoped to the enclosing function. let and const stop at the closing brace, which is what makes them predictable.",
  },
  "What is a closure in one sentence?": {
    options: [
      "A function that retains access to variables from its enclosing scope after that scope exits.",
      "A function that captures a copy of its parameters so later changes are ignored.",
      "A function that is defined inside another function and can only be called from it.",
      "A function whose variables are all shared with the global scope.",
    ],
    correctIndex: 0,
    explanation:
      "A closure is a function together with the variables it was created with. The function keeps those variables alive even after the surrounding code has finished, which is what makes counters, caches, and private state possible.",
  },

  /* ── JavaScript Survival Kit: Errors and Debugger ───────────────────── */
  "How should you handle an error you expect in user input?": {
    options: [
      "Validate before the risky operation, or wrap it in try/catch and show a clear message.",
      "Let the error bubble up so the browser console shows exactly what happened.",
      "Wrap every operation in try/catch and silently ignore anything that throws.",
      "Retry the operation in a loop until it succeeds, since errors are usually temporary.",
    ],
    correctIndex: 0,
    explanation:
      "Expected errors should be prevented: check the input before you use it. try/catch is for the failure you genuinely cannot rule out, and the user should see a clear message rather than a stack trace. Swallowing errors hides bugs.",
  },
  "What does finally guarantee, and what belongs there?": {
    options: [
      "It always runs, whether the try succeeds or throws; cleanup such as timers, flags, and connections belongs there.",
      "It runs only when the try block throws, which is why cleanup belongs in catch.",
      "It runs after the try and catch blocks, but only if no error was rethrown.",
      "It makes the error non-fatal: the function continues with an undefined result.",
    ],
    correctIndex: 0,
    explanation:
      "finally runs on every path out of the try statement, which makes it the right place for cleanup: clearing a timer, resetting a loading flag, closing a connection. A return inside try still runs finally before the function returns.",
  },
  "How do you pause execution at a specific line in DevTools?": {
    options: [
      "Click the line number in Sources to set a breakpoint, or insert a debugger statement, then run the code.",
      "Add a console.log before the line and read the value from the console output.",
      "Open the Performance panel, record the interaction, and look for the line in the flame chart.",
      "Set the breakpoint in the Network panel so the request pauses before it is sent.",
    ],
    correctIndex: 0,
    explanation:
      "A breakpoint stops the script at an exact line, with the scope panel showing every variable in view. A debugger statement does the same without opening DevTools, which helps when a bug only appears on a remote device.",
  },

  /* ── The DOM Is an API: Selecting ──────────────────────────────────── */
  "When should you use querySelector over getElementById?": {
    options: [
      "Use querySelector for CSS-selector-based or scoped queries; use getElementById for a simple unique id lookup.",
      "Always use querySelector, because getElementById is deprecated in modern browsers.",
      "Use getElementById for anything scoped to a container; use querySelector only for the document root.",
      "They behave identically; querySelector is only slower because it parses a selector.",
    ],
    correctIndex: 0,
    explanation:
      "getElementById is a fast, exact lookup of one id. querySelector takes a CSS selector, which is what you need for classes, attributes, or scoping to a container. Neither is deprecated, and the cost of parsing a selector is negligible next to the work you do with the result.",
  },
  "What is the difference between a static NodeList and a live HTMLCollection?": {
    options: [
      "A static NodeList snapshots matches; a live HTMLCollection updates as the DOM changes.",
      "Both are live, but a NodeList only contains elements while an HTMLCollection can include text nodes.",
      "A NodeList is always live and an HTMLCollection is always a snapshot taken at call time.",
      "There is no difference; both collections update automatically when the DOM changes.",
    ],
    correctIndex: 0,
    explanation:
      "getElementsByTagName and getElementsByClassName return a live HTMLCollection, so removing a node changes the collection while you are looping over it. querySelectorAll returns a static NodeList, which is why converting it with Array.from is safe.",
  },
  "querySelectorAll returns a NodeList. How do you use map on it?": {
    options: [
      "Array.from(nodes) or [...nodes], then call map.",
      "Call nodes.map directly; NodeList inherits map from Array.",
      "Use nodes.forEach((node) => node, index) to map the elements.",
      "Call Array.prototype.map.call(nodes, fn), which is the only supported way.",
    ],
    correctIndex: 0,
    explanation:
      "A NodeList is iterable but does not have array methods, so it has no map. Spreading it into an array gives you one. Array.prototype.map.call works too, but it is much harder to read.",
  },

  /* ── The DOM Is an API: Creating and Updating ───────────────────────── */
  "Why prefer textContent over innerHTML when inserting user-provided strings?": {
    options: [
      "textContent treats input as plain text; innerHTML parses it as markup, allowing XSS.",
      "textContent is faster to render because it skips the HTML parser entirely.",
      "innerHTML escapes angle brackets, so it is actually the safer choice for user text.",
      "They are interchangeable, and the difference only matters for large strings.",
    ],
    correctIndex: 0,
    explanation:
      "innerHTML hands the string to the HTML parser, so a value containing a script tag or an event handler attribute becomes live markup. textContent assigns a text node, so the same string is displayed and never executed.",
  },
  "How do you read data-item-id from an element?": {
    options: [
      "element.dataset.itemId, remembering the value is a string.",
      "element.getAttribute('data-item-id'), which returns a typed value.",
      "element.attributes.itemId, which is the camel-cased form of the attribute.",
      "element.data.itemId, which reads the attribute directly.",
    ],
    correctIndex: 0,
    explanation:
      "The dataset object is the camel-cased view of the data-* attributes: data-item-id becomes dataset.itemId. Every dataset value is a string, so convert it with Number() when you need a number.",
  },
  "Why does setAttribute('disabled', 'false') still disable a button?": {
    options: [
      "Boolean attributes are true by presence; remove the attribute or set the property to false.",
      "The value must be exactly 'true'; 'false' is parsed as an invalid boolean.",
      "setAttribute only works for non-boolean attributes, so the call is ignored.",
      "The browser disables it until the next repaint, then re-enables it.",
    ],
    correctIndex: 0,
    explanation:
      "For boolean attributes such as disabled, checked, and hidden, the presence of the attribute is the value. 'false' is still a present attribute. Use removeAttribute('disabled') or set button.disabled = false.",
  },
  "Create a button with the text Click me and append it to the body.": {
    explanation:
      "A correct answer is `const btn = document.createElement('button'); btn.textContent = 'Click me'; document.body.appendChild(btn);`. createElement makes the node, textContent sets its content safely, and appendChild inserts it into the document.",
  },

  /* ── The DOM Is an API: Traversing and Safety ───────────────────────── */
  "How do you move a node to a different parent safely?": {
    options: [
      "Append or insert it into the new parent; the DOM moves it rather than copying it.",
      "Clone the node with cloneNode, append the clone, then remove the original.",
      "Set the node's parent property directly to the new parent element.",
      "Use innerHTML to rewrite the new parent with the node's markup.",
    ],
    correctIndex: 0,
    explanation:
      "Inserting a node that already exists in the document moves it: it is not copied, and any listeners attached to it come along. That is why you never need to clone and remove.",
  },
  "Why use a DocumentFragment when building a long list?": {
    options: [
      "It collects nodes off-document so one append attaches them all, reducing layout and paint work.",
      "It lets you build the list without JavaScript, using markup declarations instead.",
      "It converts the nodes into a single string that you insert with innerHTML.",
      "It keeps the nodes alive after the page unloads, so the list can be restored.",
    ],
    correctIndex: 0,
    explanation:
      "Every insertion into the live document can trigger layout. Appending to a fragment, which is not in the document, does none of that work, and one final append attaches everything in a single pass.",
  },
  "What makes innerHTML dangerous with user input, and what should you use instead?": {
    options: [
      "It parses input as HTML, so scripts or handlers can execute; use textContent for untrusted text.",
      "It strips the characters that HTML needs, so the text always renders incorrectly.",
      "It is slow with long strings; use innerText, which parses input safely.",
      "It encodes the input before parsing, so it is only unsafe when the value is not a string.",
    ],
    correctIndex: 0,
    explanation:
      "Any markup in the value becomes live DOM, including a script tag or an onerror handler, and it runs as soon as it is inserted. For untrusted text, assign textContent and keep the markup in your own template.",
  },
  "What is the difference between children and childNodes?": {
    options: [
      "children contains only element nodes; childNodes also includes text and comment nodes.",
      "children is live while childNodes is a static snapshot of the same elements.",
      "children includes text nodes but excludes comments; childNodes includes both.",
      "They are aliases for the same collection with different iteration order.",
    ],
    correctIndex: 0,
    explanation:
      "children is an HTMLCollection of elements only, which is usually what you want. childNodes is a NodeList that also contains the whitespace and comment nodes the parser leaves behind.",
  },

  /* ── Events: First Listeners ────────────────────────────────────────── */
  "What is the difference between event.target and event.currentTarget?": {
    options: [
      "target is the element that received the event; currentTarget is the element whose listener is currently running.",
      "target is the element whose listener is running; currentTarget is the original event source.",
      "They are the same property, and currentTarget only differs during bubbling.",
      "target is always the document and currentTarget is always the element clicked.",
    ],
    correctIndex: 0,
    explanation:
      "target is where the event originated and stays the same through the whole capture and bubble path. currentTarget is the element whose listener is executing right now, so it changes at each step of the bubble.",
  },
  "Why does removeEventListener need the same function reference used in addEventListener?": {
    options: [
      "Listeners are identified by reference, so an inline arrow creates a different function that cannot be matched and removed.",
      "removeEventListener requires the exact same string of source code as the original call.",
      "Each call to addEventListener creates a private copy, so only the first one can be removed.",
      "The listener is removed automatically when the element is garbage collected.",
    ],
    correctIndex: 0,
    explanation:
      "The browser matches listeners by the function reference, the capture flag, and the event type. Two arrows written in the same place are two different objects. Keep the handler in a named variable if you ever need to remove it.",
  },
  "Attach a click listener to a button that changes the button text when clicked.": {
    explanation:
      "A correct answer is `button.addEventListener('click', () => { button.textContent = 'Clicked!'; });`. addEventListener takes the event type and a callback, and the arrow body runs when the click happens.",
  },

  /* ── Events: Bubbling and Delegation ────────────────────────────────── */
  "Why is event delegation useful?": {
    options: [
      "One listener on a common ancestor handles children; add/remove without re-binding.",
      "It makes the events fire faster because the browser skips the target phase.",
      "It lets you handle events on elements that do not exist yet in the DOM.",
      "It removes the need for event listeners entirely on dynamic lists.",
    ],
    correctIndex: 0,
    explanation:
      "With one listener on the container you can serve any number of children, including ones added later, and you never re-bind when the list changes. You find the actual item with event.target.closest(...).",
  },
  "When is stopPropagation appropriate, and what can it break?": {
    options: [
      "Appropriate when an ancestor must not react (for example a modal); it breaks delegation and ancestor listeners that rely on bubbling.",
      "Never appropriate; the correct fix is to remove the ancestor's listener from the page.",
      "Appropriate for any handler, because it also stops the browser from repainting.",
      "Only appropriate inside a delegated listener, where it prevents double handling.",
    ],
    correctIndex: 0,
    explanation:
      "Stopping propagation is for the rare case where an ancestor must not see the event, such as a dialog inside a card. The cost is that it also stops any delegated handler further up. stopPropagation does not stop other listeners on the same element; stopImmediatePropagation does.",
  },
  "Rewrite a list of three buttons so clicking any of them is handled by a single delegated listener.": {
    explanation:
      "A correct answer attaches one listener to the container and finds the button with `event.target.closest('button')`. The listener lives on the parent, so buttons added later are handled too.",
  },

  /* ── Events: Forms and Keyboard ─────────────────────────────────────── */
  "Why do you preventDefault on a form submit in an SPA?": {
    options: [
      "To stop native page navigation and handle submission via async logic.",
      "To stop the browser from validating required fields before your code runs.",
      "To prevent the form from sending its values to the server at all.",
      "To make the submit event fire twice, once for validation and once for data.",
    ],
    correctIndex: 0,
    explanation:
      "A submit event means the browser is about to navigate and reload the page. In a single-page app you call preventDefault, run your own async logic, and update the UI without a reload. The values are still read from the form with FormData.",
  },
  "Which native elements give keyboard activation for free, and which keys activate them?": {
    options: [
      "Links with Enter; buttons with Enter and Space; checkboxes with Space.",
      "Links with Enter and Space; buttons with Space only; checkboxes with Enter.",
      "All of them respond to Enter, and only buttons respond to Space.",
      "None of them; every element needs a keydown listener to be keyboard-usable.",
    ],
    correctIndex: 0,
    explanation:
      "The behaviour comes from the element's role: a link is an action on Enter, a button is an action on Enter or Space, and a checkbox toggles on Space. A div with a click handler has none of that, which is why it needs role, tabindex, and a key handler.",
  },
  "Write a submit handler that prevents the default page reload and logs the value of an input named email.": {
    explanation:
      "A correct answer calls event.preventDefault() first, then reads the field with new FormData(form).get('email'). FormData gives you the named values without reaching into the DOM.",
  },

  /* ── React Basics: Vite, JSX, Component ────────────────────────────── */
  "In JSX, how do you write the HTML class attribute?": {
    options: [
      "className.",
      "class.",
      "htmlClass.",
      "You write class normally, because JSX is just HTML.",
    ],
    correctIndex: 0,
    explanation:
      "JSX is JavaScript, not HTML, so attributes are property names and multi-word ones are camelCase: className, htmlFor, tabIndex. The compiler turns className back into class in the real HTML.",
  },
  "What does JSX compile to?": {
    options: [
      "JavaScript function calls that create React elements (the JSX runtime / React.createElement).",
      "HTML strings that React parses and injects into the page with innerHTML.",
      "A special template tag that only the browser understands at runtime.",
      "A compiled DOM diffing algorithm that bypasses React entirely.",
    ],
    correctIndex: 0,
    explanation:
      "JSX is syntax sugar. The compiler rewrites each element into a call that creates a plain object describing what to render, and React then reconciles those objects with the real DOM. No HTML string is parsed at runtime.",
  },
  "Write a React function component that renders a heading with the text Hello world.": {
    explanation:
      "A correct answer is `function HelloWorld() { return <h1>Hello world</h1>; }`. A component is a function that returns JSX, and the element it returns becomes part of the React tree.",
  },

  /* ── React Basics: Props ───────────────────────────────────────────── */
  "Are props mutable in React?": {
    options: [
      "No; props are immutable inputs from the parent.",
      "Yes, a child can assign to props, though React warns in development.",
      "Yes, as long as the prop was not passed with a spread operator.",
      "Only props passed as objects are mutable; primitives are not.",
    ],
    correctIndex: 0,
    explanation:
      "Props are read-only by design, and React throws in development if you try to assign to one. A child that needs to change something asks the parent to do it through a callback, which keeps the flow of data one-directional.",
  },
  "How does a child component request a change from its parent?": {
    options: [
      "It calls a callback function passed down as a prop; the parent updates its own state.",
      "It calls setState on the parent's state object directly.",
      "It dispatches a DOM event that the parent listens for on the window.",
      "It mutates the prop it was given, and React re-renders the parent.",
    ],
    correctIndex: 0,
    explanation:
      "The parent owns the state and passes down a function that changes it. The child calls that function, the parent re-renders, and the new value flows back down as a prop. That is the whole of one-way data flow.",
  },
  "Write a Button component that accepts a label prop and renders a button.": {
    explanation:
      "A correct answer is `function Button({ label }) { return <button>{label}</button>; }`. Destructuring the props object in the parameter list is the usual way to read a prop.",
  },

  /* ── React Basics: State and Lists ─────────────────────────────────── */
  "Why do lists need stable keys in React?": {
    options: [
      "Keys help reconciliation match items across renders; unstable keys cause bugs.",
      "Keys make React render the list faster by skipping items that did not change.",
      "Keys are required so React can apply the CSS class of the first item to all of them.",
      "Keys are only used for server rendering and are ignored in the browser.",
    ],
    correctIndex: 0,
    explanation:
      "On re-render, React compares the new list with the old one and reuses the matching DOM nodes. The key is how it decides what matches what. With unstable keys React reuses the wrong node, and state, focus, and input values jump to the wrong item.",
  },
  "Why is the array index a risky key when items can reorder?": {
    options: [
      "An index identifies a position, not an item, so inserts and reorders make React reuse the wrong element and state.",
      "Indexes are strings in React, so they never match and the list always remounts.",
      "Indexes are slower than UUIDs, so they cause the list to re-render on every keystroke.",
      "Indexes are only a problem when the list is sorted, because React forbids numeric keys.",
    ],
    correctIndex: 0,
    explanation:
      "If the item at position 0 changes, the index key is unchanged, so React keeps the old DOM node and the state that belonged to the previous item. An index key is safe only for a list that never reorders, adds, or removes items.",
  },
  "Write the code to render an array of names as a list of items with stable keys.": {
    explanation:
      "A correct answer is `names.map((name) => <li key={name}>{name}</li>)`. The key must identify the item rather than its position, so a stable value from the data such as an id is used.",
  },

  /* ── React Basics: Events, Forms, useEffect ────────────────────────── */
  "What is a controlled input in React?": {
    options: [
      "Input value comes from state and changes update state via onChange.",
      "The input has a value prop and React blocks the browser's own editing.",
      "The input's value is read from the DOM on submit instead of being tracked.",
      "The input is bound to a ref, so React re-renders it after every keystroke.",
    ],
    correctIndex: 0,
    explanation:
      "Controlled means the value lives in state: you pass value={text} and update text in onChange, and React re-renders the input with the new value. An uncontrolled input keeps its own value in the DOM and you read it through a ref when needed.",
  },
  "What does the dependency array of useEffect control?": {
    options: [
      "Which reactive values trigger the effect to run again when they change between renders.",
      "Which effects are allowed to run in the browser rather than on the server.",
      "The order in which the cleanup functions run when the component unmounts.",
      "How many times the effect is allowed to run before React stops it.",
    ],
    correctIndex: 0,
    explanation:
      "The array lists the values the effect reads. When one of them changes between renders, React runs the cleanup and then the effect again. An empty array means it runs once after the first render and never again.",
  },
  "Why must an effect that subscribes return a cleanup function?": {
    options: [
      "To unsubscribe, clear timers, or cancel work before re-running and on unmount, preventing leaks and stale updates.",
      "Because React throws an error if an effect returns nothing at all.",
      "So the effect's dependencies can be garbage collected earlier.",
      "Because the cleanup function is where you declare the values the effect uses.",
    ],
    correctIndex: 0,
    explanation:
      "Without cleanup, every re-run adds another subscription while the old ones keep firing, and an unmounted component keeps working on data nobody can see. Cleanup is the teardown half of any effect that acquires something.",
  },
  "Write a React input handler that updates component state when the user types.": {
    explanation:
      "A correct answer is `const handleChange = (e) => setValue(e.target.value);`. The change event carries the new value, and calling the state setter schedules the re-render.",
  },

  /* ── React Basics: Forms in Depth ──────────────────────────────────── */
  "How is a controlled checkbox different from a controlled text input?": {
    options: [
      "A text input uses value plus onChange; a checkbox uses checked plus onChange and reads e.target.checked.",
      "A checkbox uses value plus onChange; a text input uses checked plus onChange.",
      "There is no difference; both read their state from e.target.value.",
      "A checkbox cannot be controlled at all, because the browser owns the tick.",
    ],
    correctIndex: 0,
    explanation:
      "A text field's value is a string, so it binds to value. A checkbox is a boolean, so it binds to checked and the change event reports e.target.checked rather than e.target.value.",
  },
  "Why can a file input not be controlled?": {
    options: [
      "The browser owns the file selection and forbids setting its value from JavaScript for security; read files from the event or a ref instead.",
      "Because the File object cannot be stored in React state without losing its metadata.",
      "Because React only supports text, number, and email inputs in controlled mode.",
      "Because the file path is different in every browser and cannot be compared.",
    ],
    correctIndex: 0,
    explanation:
      "For security, a browser will not let a page set the value of a file input. You keep the input uncontrolled and read the selected File from the change event, or through a ref, and store that in your own state.",
  },
  "Where should focus go after a failed form submit?": {
    options: [
      "To the first invalid field, with its error message associated and announced.",
      "Back to the submit button, so the user can try the whole form again.",
      "To the browser's address bar, so the error survives a page refresh.",
      "Nowhere, because moving focus automatically breaks screen reader navigation.",
    ],
    correctIndex: 0,
    explanation:
      "Move focus to the first field that needs attention so the user is not hunting for the problem, and connect the error message with aria-describedby so it is announced. Announcing without moving focus leaves many screen reader users unaware anything went wrong.",
  },
  "Write a controlled select whose value comes from state.": {
    explanation:
      "A correct answer is `<select value={role} onChange={(e) => setRole(e.target.value)}>...</select>`. The select is controlled the same way a text input is: the value comes from state and onChange writes it back.",
  },

  /* ── React Basics: Routing and Styling ──────────────────────────────── */
  "Why use a Link component instead of an anchor tag for internal navigation?": {
    options: [
      "Link updates the history and renders the route without a full document request; a plain anchor reloads the page.",
      "Link sends the same request but caches it, so the page reloads faster.",
      "Link preloads every route in the app, so navigation is instant every time.",
      "An anchor tag cannot be used for internal routes in a React application.",
    ],
    correctIndex: 0,
    explanation:
      "A plain anchor asks the browser for a new document, which throws away the app state and re-downloads everything. Link intercepts the click, updates the history entry, and renders the new route with the data it already has.",
  },
  "What type do route params have, and what must you do before comparing one to a number?": {
    options: [
      "They are strings; convert with Number before numeric comparison.",
      "They are numbers already, because the router parses them for you.",
      "They are strings, so you should compare them with the === operator only.",
      "They are undefined until the route loads, and then they become strings.",
    ],
    correctIndex: 0,
    explanation:
      "A parameter comes out of the URL, and the URL is text, so '/users/7' gives you the string '7'. Comparing it with === 7 fails, and id > 10 misbehaves because '9' is greater than '10' as a string.",
  },
  "What does a CSS Module scope?": {
    options: [
      "Class names, by rewriting them to unique names; the cascade still applies normally.",
      "The whole stylesheet, so no rule outside the module can reach it.",
      "Only the properties, so a global reset cannot change them.",
      "Nothing on its own; scoping only happens when the file is imported.",
    ],
    correctIndex: 0,
    explanation:
      "A CSS Module rewrites each class name to something unique, so .card in one file cannot collide with .card in another. The rules still live in the same cascade, so specificity and order work exactly as in a normal stylesheet.",
  },
  "Why are design tokens better than repeating hex colors in components?": {
    options: [
      "They centralize decisions so themes and changes are consistent, instead of requiring a search through every component.",
      "They make the browser cache the colours, so pages using them load faster.",
      "They remove the need for a design system or any shared conventions.",
      "They let you skip CSS variables and write plain hex values in one place.",
    ],
    correctIndex: 0,
    explanation:
      "A token is a name for a decision: --color-danger, --space-3. Change the token and every component follows, and a dark theme becomes a second set of token values rather than a second stylesheet. Repeating hex values spreads one decision across a hundred files.",
  },

  /* ── React Basics: Lifting State, Custom Hooks, Mini App ───────────── */
  "When should you lift state up in React?": {
    options: [
      "When sibling or child components need shared state.",
      "Whenever a component's state changes, so the change is always visible everywhere.",
      "Never, because a parent re-render always re-renders its children.",
      "Only when the state is a boolean, since other types cannot be shared.",
    ],
    correctIndex: 0,
    explanation:
      "Lift state to the closest common ancestor of the components that need it. That keeps the state in one place and the data flow one-way. Lifting further up than necessary makes every consumer re-render for the same change.",
  },
  "What are the rules of hooks?": {
    options: [
      "Call hooks only at the top level of a component or custom hook, never conditionally or in loops.",
      "Call hooks only inside event handlers, so they run when the user acts.",
      "Call hooks in the same order in every component, but you may call them conditionally.",
      "Hooks may only be used in files named with the use prefix.",
    ],
    correctIndex: 0,
    explanation:
      "React tracks hooks by call order, so a conditional or looped hook would shift that order between renders and break the state attached to them. A hook that returns a value must also be named starting with use, so linting can find it.",
  },
  "Write a custom hook useToggle that returns a boolean and a toggle function.": {
    explanation:
      "A correct answer is `function useToggle(initial = false) { const [value, setValue] = useState(initial); const toggle = () => setValue((v) => !v); return [value, toggle]; }`. The updater form of setState reads the previous value, so the toggle stays correct even when calls are batched.",
  },

  /* ── React Basics: Errors, Suspense, and Accessibility ─────────────── */
  "What errors does an error boundary catch, and what does it miss?": {
    options: [
      "It catches render, lifecycle, and constructor errors below it; it does not catch event handler errors, async rejections, or its own errors.",
      "It catches every error thrown anywhere in the application, including network failures.",
      "It catches only errors from network requests, and never render errors.",
      "It catches render errors and async rejections, but not event handler errors.",
    ],
    correctIndex: 0,
    explanation:
      "A boundary is a React rendering concept, so it catches what happens while React renders the tree below it. Errors thrown later, in a click handler or in a promise, never pass through the render phase, so you catch those yourself with try/catch.",
  },
  "What must a module have for React.lazy to load it directly?": {
    options: [
      "A default export; otherwise map a named export to { default: ... } in the loader.",
      "A named export called default, or the lazy import will fail silently.",
      "Nothing special; React.lazy can load any module shape.",
      "A sideEffects: false field in the package.json of the module.",
    ],
    correctIndex: 0,
    explanation:
      "React.lazy expects the module to resolve to something with a default export, because that is what it treats as the component. If your module exports a named component, map it: lazy(() => import('./Chart').then((m) => ({ default: m.Chart }))).",
  },
  "What focus work does a modal need beyond rendering an overlay?": {
    options: [
      "Move focus inside, trap Tab, close on Escape, restore focus to the trigger, and hide the background from assistive technology.",
      "Only move focus to the first field; the rest is handled by the browser.",
      "Only add a close button, because keyboard users can still click it with the mouse.",
      "Nothing, as long as the overlay covers the page visually.",
    ],
    correctIndex: 0,
    explanation:
      "A modal takes over the interaction, so it has to behave like one: focus moves in and is trapped while it is open, Escape closes it, and focus returns to the button that opened it. The background also needs aria-hidden or inert so a screen reader does not wander out of the dialog.",
  },
  "Why use useId instead of a hard-coded input id in a reusable component?": {
    options: [
      "A hard-coded id repeats when the component renders more than once, breaking label and description associations; useId generates a stable unique id.",
      "Because React forbids literal ids in JSX and requires the useId hook.",
      "Because a hard-coded id is regenerated on every render and would lose focus.",
      "Because hard-coded ids are not valid HTML when they contain a colon.",
    ],
    correctIndex: 0,
    explanation:
      "If you render the component twice, a literal id appears twice, and the label then points at the wrong input. useId gives every instance its own id that stays the same across renders, so htmlFor and aria-describedby keep pointing at the right element.",
  },
};
