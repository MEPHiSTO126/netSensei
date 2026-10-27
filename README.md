# netSensei

A frontend-development course that grades written answers and connects stuck students to a live tutor.

Students move through small stages, take a retakable quiz after every phase, and request help on the exact stage where they are stuck. Tutors work a queue, reply with text or a highlighted stage link, and close the session into a saved record.

## What is included

- **Course:** 12 modules, 56 phases, 245 stages (plain text, code, charts), and 211 quiz questions across web platform, CSS, JavaScript, and React.
- **Quizzes:** one per phase, retakable, 70% to pass. Free-form and snippet questions are graded semantically, with a rule-based fallback when the AI is unavailable.
- **Progress:** completion is `passed phases / total phases`; the best attempt per phase counts.
- **Tutor loop:** stage-scoped help requests, real online presence, a tutor queue, live chat, stage highlights, session end, and read-only records.
- **Auth:** student and tutor roles, hashed passwords, 24-hour JWT cookie. Tutor registration requires an invite code.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Lucide icons |
| Database | Prisma 6 + Neon Postgres (pooled DATABASE_URL + direct DIRECT_URL) |
| Auth | `jose` JWT in an httpOnly cookie, `bcryptjs` |
| Grading | Groq `llama-3.1-8b-instant` when `GROQ_API_KEY` is set, deterministic fallback otherwise |
| Live chat | REST writes + 5-second polling; no external realtime service |

## Getting started

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The repository already contains `prisma/dev.db` with the seeded course, so on a fresh clone you can usually skip `db push` and `db:seed`. Run them when the schema changes or the database is missing.

> **Reseeding is destructive.** `npm run db:seed` deletes and recreates every stage, quiz, and question, which changes stage ids and clears phase progress and answer records. Do not reseed a database whose links you need to keep.

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `student@netsensei.local` | `student123` |
| Tutor | `tutor@netsensei.local` | `tutor123` |

### Environment

Copy `.env.example` to `.env` and fill in the values you need.

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | SQLite connection string, for example `file:./dev.db` |
| `JWT_SECRET` | Yes | Signing key for session cookies. Use a long random value outside development. |
| `GROQ_API_KEY` | No | Enables AI grading. Without it, the rule-based grader is used. |
| `TUTOR_SIGNUP_CODE` | No | When set, tutor registration requires this code. When empty, tutor registration is closed. |

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build, including type checking |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Recreate the Frontend Development course and demo accounts |
| `npm run content:css` | Regenerate `prisma/css-extra-phases.ts` from `css-extra/` |

Type-check separately with `npx tsc --noEmit`.

## How grading works

`src/lib/ai.ts` sends the question prompt, full goal, expected answer, and rubric to Groq, then parses a JSON score and short feedback. If the key is missing, the request fails, or the response is malformed, the fallback grader scores keyword coverage, answer structure, and length. The fallback never throws, so a quiz submission always returns a result.

Snippet questions are scored the same way from the submitted text. They are **not executed**; a sandboxed code runner is the next product milestone.

## How the tutor loop works

- Stage pages show the number of tutors whose heartbeat is under two minutes old.
- A request stores the stage, the question, and the student. Tutors see it in `/tutor/queue`.
- Opening a request claims the student's active session. A second tutor cannot join an active session owned by someone else.
- A tutor can send a **stage highlight** chosen from the student's requested stages; the student gets a direct link back to that stage.
- Ending a session marks it `ENDED`, stops writes, and keeps the transcript at `/sessions/[sessionId]`.
- Chat refreshes by polling every five seconds while the tab is visible. `src/app/api/tutor/stream/route.ts` is an unused SSE draft.

## Project structure

```
prisma/
  schema.prisma        data model
  seed.ts              course content, quiz questions, demo users
  dev.db               seeded SQLite database (development only)
src/
  app/
    courses/           course, module, phase, stage, quiz pages
    progress/          student completion
    tutor/queue/       request inbox and presence
    tutor/chat/        live and ended sessions
    sessions/          history and saved records
    api/               auth, quiz, tutor routes
  components/
    course/            stage renderer
    tutor/             composer, presence, request button, end button, refresh
    ui/                button, card, input, badge, navbar
  lib/
    ai.ts              Groq grading, snippet checker, fallback grader
    auth.ts            JWT sessions and role guards
    db.ts              Prisma client
    presence.ts        tutor online window
    progress.ts        per-course completion
```

## Deployment

The current SQLite file works for local development, but it is **not durable on Vercel Hobby**: the filesystem is ephemeral and writes do not survive a redeploy or a different invocation. Before deploying, move the database to Turso/libSQL or a free Postgres provider (Neon or Supabase), add migrations, and set `DATABASE_URL` and `JWT_SECRET` in the host's environment.

## Known gaps

- No sandboxed snippet runner yet; snippet answers are graded as text.
- PRO-mode quizzes, AUDIO questions, and follow-up challenge sessions exist in the schema or plan but not in the UI.
- No upload endpoint or admin authoring UI.
- No automated tests yet; the current gates are `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- `/progress` assumes the single course id `course-frontend-v1`.
- No rate limiting on tutor requests or messages.

See `PLAN.md` for the milestone history and the ranked next steps.
