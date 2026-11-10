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
};
