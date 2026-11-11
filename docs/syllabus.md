# Frontend Development - Course Syllabus

> Learn HTML, CSS, JavaScript, and React from scratch. Build real projects and get AI-powered feedback on your code.

**Edition:** November 2026  
**Format:** Self-paced modules on netSensei with tutor support and live sessions  
**Volume:** 4 modules | 12 phases | 57 lessons | 12 quizzes (44 questions)

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
- **4. Flexbox and Grid** - _in development_ - Lay out one-dimensional rows and columns with flexbox, then two-dimensional pages with grid.

## 4. Assessment

- Each phase ends with a quiz. 44 questions across the course. Questions are multiple choice wherever a single defensible answer exists; a small number stay open-ended where producing the answer is the point.
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
