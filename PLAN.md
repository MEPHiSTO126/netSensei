# netSensei — Project Plan

**Product:** A frontend-development course with AI-graded phase quizzes and a live tutor loop.
**Status:** Content complete; app shell, progress tracking, and the tutor session loop are built. Deployment readiness is the next milestone.
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 6 + SQLite · custom JWT auth · Groq (free tier) with a deterministic fallback grader.

---

## 1. What the product does

A student works through a course in small stages (text and charts), takes a retakable quiz after every phase, and can ask a tutor about the stage they are stuck on. A tutor sees the request in a queue, opens a live chat, replies with text or a highlighted stage link, and ends the session. The conversation is kept as a read-only record.

Completion is calculated from passed phase quizzes only: `passed phases / total phases`. A phase passes at 70%; a failed attempt can be retaken and the best score counts.

---

## 2. What is built

### Student

- Course → module → phase → stage navigation with per-phase progress and a next-step path.
- Stage renderer for plain text with inline code, fenced code blocks, images, and simple process charts.
- One NORMAL quiz per phase, retakable, 70% pass threshold, per-question feedback and scores.
- Answer grading through Groq `llama-3.1-8b-instant`, with a rule-based fallback when there is no key, a timeout, or rate limiting.
- Progress page with overall percentage, passed phases, and recent attempts.
- "Request tutor help" on every stage, with the real number of online tutors.
- Tutor chat with 5-second refresh, stage highlights that link back to the exact stage, and an ended state that becomes read-only.
- Session history (`/sessions`) and a saved record per session (`/sessions/[sessionId]`).

### Tutor

- Invite-only tutor registration (`TUTOR_SIGNUP_CODE`); the seeded tutor still works.
- Tutor queue with the student, stage, question, and wait time.
- Presence heartbeat every 25 seconds; a tutor counts as online only while `lastSeen` is under 2 minutes old.
- Claiming an unassigned session, blocking another tutor's active session, marking the originating request answered.
- Replying with plain text or a stage highlight chosen from the student's requested stages.
- Ending a session; the record stays available to both participants.

### Content

| Item | Count |
|------|-------|
| Modules | 12 |
| Phases | 56 |
| Stages | 245 (221 text, 24 charts) |
| Quiz questions | 211 (181 text, 30 snippet) |
| Quizzes | 56, all NORMAL, 70% threshold |

Curriculum order is Web platform (workshop, HTTP, browser internals, HTML, CSS) → JavaScript → React. Content is seeded from `prisma/seed.ts`; there is no authoring UI yet.

---

## 3. Architecture

```
Browser
  ├─ Server Components: course, stage, quiz, progress, sessions, queue
  ├─ Client Components: quiz answers, tutor composer, presence heartbeat, polling refresh
  └─ Route handlers: auth, quiz submit, tutor request/messages/end/heartbeat
        │
        ├─ Prisma → SQLite (prisma/dev.db)
        ├─ jose JWT in an httpOnly cookie + bcryptjs hashes
        └─ Groq API (optional) → rule-based grader fallback
```

- **Auth:** custom session cookie (`netSensei_session`), role `STUDENT | TUTOR`, `getCurrentUser` / `requireTutor` guards on pages and route handlers.
- **Grading:** `src/lib/ai.ts` scores answers against a full goal, expected answer, and rubric; the fallback uses keyword coverage, structure, and length so the quiz never depends on the network.
- **Tutor channel:** REST writes plus polling reads. `src/app/api/tutor/stream/route.ts` is an unused SSE draft; it is not part of the live path.
- **Presence:** `src/lib/presence.ts` centralizes the online window so queue, stage pages, and chat agree.
- **Design:** one accent (`#1f6ae1`), heading colour `#0f2a44`, Lucide line icons, no gradients.

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing page, redirects signed-in users to `/courses` |
| `/courses`, `/courses/[courseId]` | Course catalogue and module/phase overview |
| `/courses/.../[phaseId]` | Phase overview and quiz entry |
| `/courses/.../[stageId]` | Stage content, tutor request |
| `/courses/.../quiz` | Quiz attempt |
| `/progress` | Student completion and attempts |
| `/tutor/queue` | Tutor inbox and presence |
| `/tutor/chat` | Live or ended session |
| `/sessions`, `/sessions/[sessionId]` | History and saved records |
| `/login`, `/register` | Auth, including tutor access code |

---

## 4. Milestones

### Done

- [x] P0 — Course hierarchy, seeded Frontend Development course.
- [x] P0 — Text/chart/image stage renderer.
- [x] P0 — Phase quizzes, retakes, 70% threshold, AI + fallback grading.
- [x] P0 — Progress tracking by passed phases.
- [x] P0 — Auth with student/tutor roles; invite-only tutors.
- [x] P0 — Tutor requests tied to stages, queue, live presence.
- [x] P0 — Live chat, stage highlights, session end, saved records.
- [x] P0 — Responsive app shell and navigation.

### Next

- [ ] **P1 — Deployment readiness.** Replace SQLite on Vercel Hobby with Turso/libSQL or a free Postgres (Neon/Supabase), add migrations, set production secrets, and verify writes survive a redeploy. SQLite on the Hobby filesystem loses writes between invocations.
- [ ] **P2 — Snippet runner.** Sandboxed HTML/CSS/JS execution in an iframe or Web Worker, wired to SNIPPET questions. Today those 30 questions are answered as text and graded semantically; the code never runs.
- [ ] **P3 — Follow-up challenge sessions.** Create a challenge per answered question, with its own short path and record.
- [ ] **P4 — Quiz depth.** PRO branching mode (currently schema-only: all 56 quizzes are NORMAL), AUDIO answers, and image-based questions.
- [ ] **P5 — Quality and operations.** Automated tests for grading and session access, rate limiting on requests/messages, pagination beyond the current 50-session cap, password reset.
- [ ] **P6 — Authoring.** Admin UI for courses, stages, media uploads, and quizzes; content is seed-only today.

---

## 5. Known gaps and risks

- SQLite is a single-writer database and is not durable on Vercel's filesystem. This blocks a real deployment, not a demo.
- `/progress` still hardcodes `course-frontend-v1`; multi-course support would need the id passed or selected.
- No upload endpoint or admin authoring; IMAGE stages render from `imageUrl` but no content uses them.
- No rate limiting on tutor requests, messages, or snippet checks.
- The SSE route is unused; chat freshness depends on 5-second polling and a visible tab.
- No automated test suite yet. `tsc`, ESLint, and a production build are the current gates.
- `prisma/dev.db` is tracked in git with the seeded content and demo accounts, so a reseed changes stage ids. Fine for development; not a production pattern.
- Tutor registration is closed unless `TUTOR_SIGNUP_CODE` is set.

---

## 6. Local development

See `README.md` for installation, environment variables, demo accounts, and commands.

Short version:

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```
