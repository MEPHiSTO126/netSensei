# netSensei — Project Plan

**Project:** netSensei  
**Parent folder:** `C:\Users\OLA\Documents\GnidoC\netSensei`  
**Product:** Frontend tutoring / general learning platform (frontend course only, v1)  
**Status:** Planned — ready for worktree movement into this folder  
**Reference:** Handwritten plan (course → modules → phases → stages; snippet tests; tutor chat)

---

## 1. Product Vision

netSensei is a general learning website that will initially host one course: **Frontend Development**. The goal is immersive, tutor-connected learning where students work through structured course content (modules → phases → stages), take retakable quizzes after each phase, write code in a live snippet environment with AI-powered semantic grading, and can request live tutor help when a tutor is online.

---

## 2. Core Domain Model (from handwritten plan)

```
Course
├─ Modules (ordered)
│   └─ Phases
│       └─ Stages
│           ├─ Text
│           ├─ Images
│           └─ Charts
│           └─ Quiz (after each phase)
│               ├─ Normal mode
│               └─ Pro mode (branching)
│               ├─ Full goals (predefined)
│               ├─ Type into prompt (predefined)
│               ├─ (i) Dynamic Snippets — AI powered semantic code checker
│               └─ (ii) AI powered grading system
│           └─ Tutor interaction layer
│               ├─ Live chat (only shows if tutor is online)
│               ├─ Live + recorded session (saved as a 'record'/log)
│               ├─ Tag answer stage to request tutor access
│               ├─ Tutor can highlight a stage as part of a response (for reference)
│               └─ Follow-up challenge session created per question asked
```

**Completion rules:**
- Courses have % completion based on after-phase quizzes
- All tests can be retaken
- Stages can be tagged to a question/answer for tutor follow-up

---

## 3. Feature Map

| Area | Feature | Priority | Notes |
|------|---------|----------|-------|
| **Course structure** | Modules → Phases → Stages hierarchy | P0 | 8 completions based on after-phase quiz endings |
| **Content** | Text + Images + Charts per phase | P0 | Broken down into equal number of stages |
| **Quizzes** | After each phase; retakable | P0 | Normal → Pro branching |
| **Snippet tester** | Dynamic Snippets — AI semantic code checker | P1 | Type into prompt, predefined full goals |
| **AI grading** | AI powered grading system | P1 | For non-code answers |
| **Tutor access** | Live chat only when tutor online | P0 | Tag answer stage to request access |
| **Session records** | Live + recorded sessions saved | P0 | Student can check late when answered |
| **Tutor highlights** | Tutor highlights a stage as part of response | P1 | For reference |
| **Follow-up** | Challenge session created per question | P1 | Enables follow-up challenge |
| **Progress** | % completion tracked | P0 | Based on quiz endings |

---

## 4. Suggested Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | Consistent with existing OpenCode project skills |
| Styling | Tailwind CSS | Matches existing design rules ([R0]–[R12]) |
| Language | TypeScript | Type safety |
| State | React Server Components + Client Components | SSR-first, interactive where needed |
| Snippet runner | Client-side iframe / Web Worker | Safe sandbox for frontend snippets (HTML/CSS/JS) |
| AI grading | LLM API (semantic checker + dynamic snippets) | For code + free-form answers |
| Real-time | WebSockets / SSE | Tutor live chat & online status |
| Auth | NextAuth / custom | Student + tutor roles |
| DB | Postgres + Prisma | Courses, modules, phases, stages, quizzes, session records, answers |
| Storage | S3 / local | Uploaded images/charts/audio answers |
| Deploy | Vercel / Docker | Simple deployment |

---

## 5. Suggested Folder Structure

```
netSensei/
├── README.md
├── PLAN.md                 (this file)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/                (Next.js App Router)
│   │   ├── (auth)/
│   │   ├── courses/
│   │   │   └── [courseId]/
│   │   │       ├── [moduleId]/
│   │   │       │   └── [phaseId]/
│   │   │       │       └── [stageId]/
│   │   │       │           └── page.tsx
│   │   ├── snippets/
│   │   │   └── [snippetId]/
│   │   ├── tutor/
│   │   │   └── chat/
│   │   └── sessions/
│   │       └── [sessionId]/
│   ├── components/
│   │   ├── ui/             (shadcn-style, customized)
│   │   ├── course/         (stage renderer, media, quiz)
│   │   ├── snippet/        (code editor, runner, AI feedback)
│   │   └── tutor/          (chat widget, online status, highlight)
│   ├── lib/
│   │   ├── ai.ts           (semantic checker + AI grader)
│   │   ├── db.ts           (Prisma client)
│   │   └── auth.ts
│   └── types/
├── public/
└── tests/
```

---

## 6. Build Order (Suggested)

| Phase | Work | Deliverable |
|-------|------|-------------|
| **P1** | Repo init, auth, DB schema, course CMS (modules/phases/stages) | A student can browse course content |
| **P2** | Stage renderer (text, images, charts), quiz after each phase | Student can progress and take quizzes |
| **P3** | Snippet editor + runner (HTML/CSS/JS), semantic AI checker | Student writes code, gets AI feedback |
| **P4** | AI powered grading for free-form answers | Quiz auto-grades text/audio answers |
| **P5** | Tutor online status, live chat widget, tag-to-request-access | Student can flag a stage for tutor help |
| **P6** | Live + recorded sessions, tutor highlight of stage, follow-up challenge sessions | Full tutor-student loop |
| **P7** | % completion tracking, retakable tests, UI polish | Complete frontend course experience |

---

## 7. Design Principles (from existing OpenCode rules, adapted)

- **One flat accent** — no purple-blue gradients, no gradient hero text
- **Cards** `#ffffff` radius 10, CTA `#1f6ae1` radius 12
- **Text** headings `#0f2a44`, body `#000000`, muted `#667085`
- **Lucide icons only**, 16/20/24px, no emoji
- **₦ amounts + realistic names** where applicable (Nigerian context)
- **Mobile-first**, touch targets ≥ 44px
- **All six data states** per view: empty, loading (skeleton), partial, offline, error, stale
- **No backend internals in UI** — plain sentence + retry on error
- **One fixed primary action** per flow
- **Skeleton loaders**, not bare spinners; every tap acknowledged within ~100ms

---

## 8. Database Schema Sketch (Prisma)

```prisma
model User { id, email, role (STUDENT|TUTOR), isOnline, lastSeen }
model Course { id, title, description, modules Module[] }
model Module { id, courseId, title, order, phases Phase[] }
model Phase { id, moduleId, title, order, stages Stage[], quiz Quiz }
model Stage { id, phaseId, title, type (TEXT|IMAGE|CHART), content, order }
model Quiz { id, phaseId, mode (NORMAL|PRO), questions Question[] }
model Question { id, quizId, type (SNIPPET|TEXT|AUDIO), fullGoal, answer }
model Snippet { id, questionId, code, language, aiFeedback, score }
model Session { id, studentId, tutorId, mode (LIVE|RECORDED), status, createdAt }
model Message { id, sessionId, senderId, content, type (TEXT|AUDIO|HIGHLIGHT), stageId }
model AnswerRecord { id, studentId, stageId, questionId, content, score, createdAt }
```

---

## 9. Immediate Next Step

1. Create the worktree from this `netSensei` folder (via `session.moveToWorktree` in OpenChamber, carrying this `PLAN.md` if desired).
2. Run `git init` + initial commit inside `netSensei`.
3. Begin Phase P1: repo init, auth, DB schema, course CMS.

---

**Files to carry when moving the session:** `PLAN.md` (this file). The teaching-kit materials from the earlier frontend curriculum can serve as reference for UI patterns but are not part of netSensei proper.
