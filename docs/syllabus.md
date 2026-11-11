# Frontend Development - Course Syllabus

> Learn HTML, CSS, JavaScript, and React from scratch. Build real projects and get AI-powered feedback on your code.

**Edition:** November 2026  
**Format:** Self-paced modules on netSensei with tutor support and live sessions  
**Volume:** 12 modules | 56 phases | 245 lessons | 56 quizzes (211 questions)

---

## 1. Learning outcomes

By the end of this course you will be able to write a standards-based HTML page from a blank file and explain what the browser does with it; style it with predictable CSS using the cascade, the box model, and a deliberate type and spacing system; read a DevTools trace rather than guessing at a bug; and use JavaScript and React to make that page interactive and componentised.

Every unit is written around one idea: understand the mechanism, not just the syntax. You are expected to be able to explain why something happens, not only that it happens.

## 2. How the course is structured

- **Module** - a subject area. Four modules make up the course.
- **Phase** - one topic inside a module, usually taught in one sitting.
- **Lesson** - a single stage of reading, ending with a quiz.
- **Quiz** - checks the phase, returns the correct answer and the reasoning immediately, and can be retaken as often as you need.

## 3. Curriculum outline

### Module 1: Orientation: The Workshop

Meet the four panes of the workshop — editor, browser, terminal, and the run loop — then create, serve, and inspect your first page.

- **1. Meet the Workshop** - The four panes of the development workshop and the edit-save-refresh loop. _(~2h 15m) - quiz: 3 questions, pass at 70%_
  - The Editor and File Explorer
  - The Browser and URL Bar
  - The Terminal
  - The Loop
  - Saving, Caching, and Hard Reloads
- **2. First Page and Run It** - Create index.html, understand document anatomy, serve it, and resolve file paths. _(~2h 15m) - quiz: 3 questions, pass at 70%_
  - HTML Document Anatomy
  - Serve and Open
  - Add and See the h1
  - File Paths and Relative References
  - View Source vs the Live DOM
- **3. Reading Tools** - DevTools panels, reading errors plainly, and your first git commits. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - DevTools Elements and Console
  - Reading Errors Plainly
  - Git Basics
  - Your First Commit

### Module 2: What Happens When You Hit Enter

From keypress to painted pixels: DNS, TCP and TLS, HTTP, the critical rendering path, and the Network panel.

- **1. The Wire** - From the moment you press Enter to the response arriving. _(~2h 15m) - quiz: 4 questions, pass at 70%_
  - DNS Resolution
  - TCP and TLS
  - HTTP Methods and Status Codes
  - URL Anatomy
  - Request and Response Headers
- **2. Critical Rendering Path from the Network View** - How a fetched response becomes a painted frame. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Fetch and Response
  - Parse HTML and CSS
  - Bytes to Pixels
  - Render Tree to Pixels
- **3. DevTools Network Panel** - Reading requests, timings, and failures like a diagnostic report. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Request List and Refresh
  - Status Codes and Timings
  - Inspecting Failed Requests
  - Waterfall Reading

### Module 3: Inside the Browser

The DOM, the CSSOM, the render tree, and the frame budget — what the browser actually does between bytes and pixels.

- **1. DOM, CSSOM, Render Tree** - How the browser's two trees merge into one render tree. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - DOM Tree
  - CSSOM
  - Render Tree
  - Two Trees, One Render Tree
- **2. Layout, Paint, Composite, Frame Budget** - Rendering costs and the 16.67ms frame. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Layout and Reflow
  - Paint and Composite
  - Reflow vs Repaint vs Composite
  - Frame Budget
- **3. Blocking and First Paint** - What delays the first pixel, and how to read a trace. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Render-Blocking Resources
  - First Paint Timing
  - Async, Defer, and Module Scripts
  - Reading a Performance Trace

### Module 4: CSS: The Styling Layer

The language that turns markup into an interface: selectors and the cascade, the box model, type and color, flexbox and grid, responsive layout, positioning, motion, components, and modern CSS architecture.

- **1. Selectors and the Cascade** - Match elements with selectors and understand which declaration wins when rules disagree. _(~2h 35m) - quiz: 5 questions, pass at 70%_
  - A Rule Has Three Parts
  - Type, Class, and ID Selectors
  - Combinators and State
  - Which Rule Wins
  - Specificity Without Guessing
  - Inheritance and Custom Properties
- **2. The Box Model** - Every element is a box. Learn the four layers, how width is calculated, and how overflow behaves. _(~2h 35m) - quiz: 5 questions, pass at 70%_
  - Four Boxes, One Element
  - box-sizing: border-box
  - Block, Inline, and Inline-Block
  - Box From the Inside Out
  - Margins, Gaps, and Collapse
  - Overflow, Intrinsic Size, and Aspect Ratio
- **3. Type, Color, and Spacing** - Set readable type, build a color system with contrast, and space elements on a deliberate scale. _(~2h 35m) - quiz: 6 questions, pass at 70%_
  - A Type Stack That Loads
  - Fluid Type with rem and clamp
  - Color Models and Contrast
  - Contrast Check
  - A Spacing Scale, Not Guesswork
  - Borders, Radius, Shadow, and Focus
- **4. Flexbox and Grid** - Lay out one-dimensional rows and columns with flexbox, then two-dimensional pages with grid. _(~2h 35m) - quiz: 5 questions, pass at 70%_
  - Flex Is One Dimension
  - Growing, Shrinking, and Wrapping
  - Alignment Without Margins
  - The Flex Axis
  - Grid Defines Two Dimensions
  - Placing Items and Naming Areas
- **5. Responsive Layout in Practice** - Adapt layouts to real screens with mobile-first queries, fluid units, responsive images, and a debugging routine. _(~2h 35m) - quiz: 5 questions, pass at 70%_
  - The Viewport and Mobile First
  - Media Queries and Container Queries
  - Responsive Units and Images
  - Breakpoint Ladder
  - Debugging Layout
  - Capstone: A Responsive Landing Page
- **6. Positioning and Layering** - Take boxes out of normal flow, anchor overlays, and control which layer paints on top. _(~2h 35m) - quiz: 6 questions, pass at 70%_
  - Normal Flow, Float, and Clear
  - Relative and Absolute
  - Fixed, Sticky, and Scroll-Aware UI
  - Stacking Order and z-index
  - Overlays: Dropdowns, Modals, and Tooltips
  - Capstone: Sticky Header with Menu and Badge
- **7. Motion and Visual Effects** - Animate state changes with transitions and keyframes, use transforms and filters, and respect a motion budget. _(~2h 35m) - quiz: 6 questions, pass at 70%_
  - Transitions: From State to State
  - Transforms: Move, Rotate, Scale
  - Keyframe Animations
  - Motion Budget and Reduced Motion
  - Opacity, Filters, and Depth
  - Gradients, Background Layers, and Texture
- **8. Components and Content** - Style the parts people actually use: links, navigation, forms, tables, icons, and generated content. _(~2h 35m) - quiz: 6 questions, pass at 70%_
  - Links, Lists, and Navigation
  - Forms That People Can Use
  - Tables for Data
  - Generated Content and Pseudo-elements
  - Pseudo-elements, Icons, and Counters
  - Capstone: A Settings Page
- **9. Modern CSS and Architecture** - Keep styles maintainable with native nesting, cascade layers, feature queries, relational selectors, logical properties, and themes. _(~2h 35m) - quiz: 6 questions, pass at 70%_
  - Nesting and Cascade Layers
  - Feature Queries and Honest Fallbacks
  - Relational Selectors and Registered Properties
  - :has(), @property, and Stateful CSS
  - Logical Properties and Writing Modes
  - Themes, Print, and Delivery

### Module 5: JavaScript Survival Kit

Just enough JavaScript before the DOM and events: values, types, functions, control flow, objects, arrays, scope, hoisting, errors, and the debugger.

- **1. Values and Types** - Primitives, declarations, typeof, and conversion. _(~2h 15m) - quiz: 4 questions, pass at 70%_
  - Primitives
  - let and const vs var
  - typeof
  - Type Conversion
  - Text to Number to Decision
- **2. Functions and Control Flow** - Declarations, arrows, returns, conditionals, and loops. _(~2h 15m) - quiz: 4 questions, pass at 70%_
  - Function Declarations and Arrows
  - Return and Conditionals
  - Loops
  - Guard Clauses and Early Returns
  - switch and Lookup Tables
- **3. Objects and Arrays** - Object literals, array iteration, and the transform methods. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - Objects and Dot Access
  - Arrays and forEach
  - map, filter, find
  - Object.keys, values, entries
- **4. Scope and Hoisting** - Where names live, and when they become readable. _(~1h 35m) - quiz: 3 questions, pass at 70%_
  - Scope
  - Hoisting
  - Closures Preview
- **5. Errors and Debugger** - Handling failure and stepping through code. _(~1h 35m) - quiz: 3 questions, pass at 70%_
  - try and catch
  - Reading Errors and Debugger
  - Console Methods

### Module 6: The DOM Is an API

Selecting, creating, updating, traversing the DOM, and keeping updates safe.

- **1. Selecting** - querySelector, getElementById, and the collection types. _(~1h 35m) - quiz: 3 questions, pass at 70%_
  - querySelector
  - getElementById Contrast
  - NodeList vs HTMLCollection
- **2. Creating and Updating** - createElement, textContent, classList, dataset, attributes, and removal. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - createElement and textContent
  - classList and dataset
  - Attributes vs Properties
  - Removing and Replacing
- **3. Traversing and Safety** - Walking the tree, batching updates, and preventing injection. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - Traversal
  - Building a List Safely
  - XSS and innerHTML
  - Select, Build, Attach

### Module 7: Events: The Page Talks Back

addEventListener, the event object, bubbling, delegation, forms, keyboard access.

- **1. First Listeners** - Registering handlers and reading the event object. _(~1h 35m) - quiz: 3 questions, pass at 70%_
  - addEventListener
  - The Event Object
  - Removing Listeners and Options
- **2. Bubbling and Delegation** - Event propagation and delegated listeners. _(~1h 35m) - quiz: 3 questions, pass at 70%_
  - The Three Phases
  - Bubbling in Practice
  - Delegation Pattern
- **3. Forms and Keyboard** - Submit handling, form data, and keyboard access. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Submit and preventDefault
  - Reading Form Data
  - Keyboard Access and Focus
  - Input, Change, Keydown

### Module 8: JavaScript Core

Types and coercion, strings and regex, numbers and dates, arrays and objects, collections and classes, JSON and browser storage, modules and errors.

- **1. Types and Coercion** - Equality, truthiness, and the conversion traps. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Strict Equality
  - Truthiness
  - Coercion Pitfalls
  - Number Parsing and NaN
- **2. Scope and Functions** - Scope chains, closures, callbacks, and this. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Scope Chain
  - Closures in Practice
  - Callbacks and Higher-Order Functions
  - Arrow Functions and this
- **3. Arrays and Objects Toolkit** - map, filter, reduce, search, sort, destructuring, spread, and copies. _(~2h 35m) - quiz: 6 questions, pass at 70%_
  - map and filter
  - reduce
  - Find, Some, Every
  - Sort, Slice, and Splice
  - Destructuring and Spread
  - Shallow vs Deep Copies
- **4. Strings and Patterns** - Template literals, string methods, and regular expressions. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - Template Literals
  - String Methods
  - Regular Expressions
  - Regex in Practice
- **5. Numbers, Math, and Dates** - Floating point, Math, formatting, dates, time zones, and Intl. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - Numbers and Math
  - Formatting Numbers
  - Dates and Time
  - Intl Dates
- **6. Collections and Classes** - Set, Map, weak collections, classes, and prototypes. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - Set and Map
  - WeakMap and WeakSet
  - Classes
  - Prototypes
- **7. JSON, Storage, and URLs** - Serialization, browser storage, query strings, and cache choices. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - JSON
  - localStorage and sessionStorage
  - URL and URLSearchParams
  - Browser Data Patterns
- **8. Modules and Errors** - ES modules and predictable failure. _(~1h 35m) - quiz: 3 questions, pass at 70%_
  - Modules
  - Error Objects and throw
  - try/catch Patterns

### Module 9: Async and the Event Loop

Call stack, queues, promises, async/await, fetch, cancellation, six data states.

- **1. Sync vs Async and Queues** - The execution model behind every async bug. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Call Stack and Sync
  - Task and Microtask Queues
  - Event Loop
  - Blocking the Main Thread
- **2. Promises** - States, chaining, and combinators. _(~1h 35m) - quiz: 3 questions, pass at 70%_
  - Promise States
  - then, catch, finally
  - Promise Combinators
- **3. async/await and fetch** - Async syntax, network requests, and cancellation. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - async and await
  - fetch and Response
  - Timeouts and AbortController
  - Error Handling Patterns
- **4. Six Data States** - Loading, empty, error, stale, offline, and success. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Loading
  - Empty
  - Error
  - Stale and Offline

### Module 10: State

State vs props vs derived data, immutability, one-way flow, refs, context, reducers, and performance.

- **1. State vs Prop vs Derived** - What a component owns, what it receives, and what it computes. _(~2h 35m) - quiz: 3 questions, pass at 70%_
  - State Loop
  - What State Is
  - Props Are Inputs
  - Derived State
  - Choosing Where State Lives
  - Lifting State
- **2. Immutability and One-Way Flow** - Updating state without mutation bugs. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Immutable Updates
  - Updating Arrays
  - The Two-Copies Bug
  - One-Way Data Flow
- **3. State in the Real UI** - Forms, requests, URLs, reducers, and restraint. _(~2h 15m) - quiz: 3 questions, pass at 70%_
  - Form State
  - Request State
  - URL as State
  - Reducer Mental Model
  - When Not to Use State
- **4. Refs, Context, and Performance** - Use refs, share state with context, reduce with useReducer, and memoize with evidence. _(~1h 55m) - quiz: 5 questions, pass at 70%_
  - useRef
  - Context
  - useReducer in Practice
  - Memoization

### Module 11: React Basics

Vite, JSX, components, props, state, lists, forms, effects, routing, styling, hooks, error boundaries, accessibility, mini-app.

- **1. Vite, JSX, Component** - The React foundation: tooling, JSX, and rendering. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Vite and JSX
  - First Component
  - JSX Rules
  - Render and Reconcile
- **2. Props** - Passing data down and asking for changes up. _(~1h 35m) - quiz: 3 questions, pass at 70%_
  - Props Passing
  - Read-Only Props
  - Composition and children
- **3. State and Lists** - useState, stable keys, conditional UI, and derived values. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - useState
  - Lists and Keys
  - Conditional Rendering
  - Derived Values During Render
- **4. Events, Forms, useEffect** - Handlers, controlled inputs, effects, and cleanup. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - Events via Props
  - Controlled Forms
  - useEffect
  - Dependencies and Cleanup
- **5. Forms in Depth** - Selects, checkboxes, radios, files, validation, and accessible form markup. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - Select, Radio, and Checkbox
  - Textarea, File, and Uncontrolled
  - Validation and Errors
  - Accessible Form Markup
- **6. Routing and Styling** - React Router, URL params, CSS Modules, and a consistent styling system. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - React Router Basics
  - Params and Query Strings
  - CSS Modules
  - Styling Systems and States
- **7. Lifting State, Custom Hooks, Mini App** - Compose stateful logic and build the first real app. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Lifting State
  - Custom Hooks
  - Mini App Build Plan
  - Capstone Checklist
- **8. Errors, Suspense, and Accessibility** - Boundaries, lazy loading, portals, and React-specific focus work. _(~1h 55m) - quiz: 4 questions, pass at 70%_
  - Error Boundaries
  - Lazy Loading and Suspense
  - Portals and Dialogs
  - React Accessibility Patterns

### Module 12: Shipping It

Git workflow, deploy, environment variables, accessibility, performance, capstone brief, what's next.

- **1. Git Workflow** - Branch, commit, review, merge. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Git Basics
  - Branch and Commit
  - Pull Requests
  - Merge Conflicts
- **2. Deploy** - Build output, static hosting, env vars, and smoke checks. _(~1h 55m) - quiz: 3 questions, pass at 70%_
  - Build Output
  - Static Hosting
  - Environment Variables
  - Post-Deploy Checks
- **3. Accessibility, Performance, Capstone Brief, What's Next** - Final polish and the road ahead. _(~2h 15m) - quiz: 3 questions, pass at 70%_
  - Accessibility Checklist
  - Keyboard and Screen Reader Pass
  - Performance and Core Web Vitals
  - Capstone Brief
  - What's Next

## 4. Assessment

- Each phase ends with a quiz. 211 questions across the course. Questions are multiple choice wherever a single defensible answer exists; a small number stay open-ended where producing the answer is the point.
- The pass mark is 70% per quiz. Unfinished questions are counted as wrong, so answer everything you can.
- Every submission returns the correct answer and a short explanation of why it is correct, so a failed quiz still teaches.
- Quizzes may be retaken. A retake re-grades from scratch and updates your phase progress; your best score is kept.
- Written answers and code are marked against the rubric for that question, and the mark is returned with the reference answer.

## 5. Tutor support

You are never expected to be stuck alone. Support is available at three levels, and using them is part of the course, not a favour.

- **Ask on the lesson.** Any lesson has a request-help control. Your question arrives attached to that exact lesson, so the answer can be given against the material you were reading.
- **Tutor chat.** A live conversation with a tutor, with the full thread saved so you can refer back to it.
- **Sessions.** Live one-to-one time, booked around the working week. Sessions are used for what the platform cannot do: unblocking a stalled line of reasoning, agreeing the direction of a project, and keeping momentum.

## 6. Suggested pace

One phase is roughly one to two hours of focused work including the quiz. A workable rhythm is two phases a week with a short written recap between them, plus one live session. Spacing the work out matters more than doing more of it - the same material spread across a week is retained far better than the same material crammed into a weekend.

Progress is tracked per phase, so a tutor can see exactly where a gap is and target the next session at it instead of re-teaching what is already solid.

## 7. What you need

- A code editor (VS Code is fine) and the browser's developer tools, which the course treats as a primary instrument rather than a fallback.
- A terminal and Node.js for running a local server. The course works on Windows, macOS, and Linux.
- No prior programming experience is assumed for the first two modules. Everything from the terminal onwards is taught in the lessons.

## 8. In development

The following units are being written and will appear in the course outline as they are published. The order can shift to match a target framework or deadline.

- Flexbox and Grid - one- and two-dimensional layout.
- Responsive layout, positioning, and motion.
- JavaScript fundamentals - the DOM, events, `fetch`, and modules.
- React fundamentals - components, state, effects, and data fetching.

## 9. Course agreements

- Read the lesson before the quiz and attempt it without notes first. The quiz is a check on understanding, not a memory test.
- When something is unclear, ask on that lesson rather than guessing. A question attached to a lesson is answered far faster than one that arrives without context.
- Write your own code. Exercises are written to be attempted, not copied; the value is in the attempt and the correction.
- Use the request and chat systems for genuine questions about the material.

---

This syllabus is generated from the live course outline, so it always matches what is actually published.
