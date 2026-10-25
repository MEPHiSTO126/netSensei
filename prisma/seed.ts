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
