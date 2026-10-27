# netSensei - Content Audit, Tutor Touchpoints, and IMAGE Handling Plan

**Goal:** Complete the remaining work: final content audit + tutor-touchpoint wiring (stage → tutor highlights), and IMAGE stage placeholder handling. Keep within $0 budget constraints and existing architecture.

## Current State
- Platform Phases 0–5 built, build green, dev server running
- 11 modules / 83 stages / 36 quizzes in `prisma/seed.ts`
- SNIPPET + semantic grading wired (Groq free tier + rule-based fallback)
- Stage renderer upgraded (code blocks via ``` fences, ChartDiagram splits on →)
- SNIPPETs added for Modules 06/08/10
- Remaining: final content audit, tutor-touchpoint wiring, IMAGE placeholder handling

## Constraints
- $0 budget: SQLite + Prisma SQLite, local `public/uploads/`, custom JWT via jose+bcryptjs, Groq free tier + rule-based fallback, SSE+polling, Vercel Hobby
- Content: detailed/immersive/near-excessive, small stages, quiz at end of phase, quizzes retakable, completion % = passed phases/total, threshold default 70%
- PowerShell environment
- Stage types: TEXT, IMAGE, CHART

## 1) Final Content Audit
**Objective:** Verify content completeness, quality, consistency against requirements.

### Tasks
- [ ] **Inventory audit**: Verify module/phase/stage counts match expectations (11 modules / 83 stages / 36 quizzes). Cross-check against `prisma/seed.ts` structure.
- [ ] **Content depth check**: Spot-check Modules 01-11 for "detailed/immersive/near-excessive" requirement. Ensure concepts broken into small stages (no skimming).
- [ ] **Question coverage**: Verify every phase has quiz with appropriate questions. Check SNIPPET vs TEXT distribution makes sense.
- [ ] **Grading alignment**: Verify SNIPPET questions have `fullGoal`, `expectedAnswer`, `rubric` populated. TEXT questions have reasonable expectations.
- [ ] **Ordering validation**: Confirm curriculum order matches roadmap.sh/frontend, MDN, techstack.sh, greatfrontend, readytodev, react.dev: Web platform → JavaScript → React; Module 02 before 03 before 04 before 10.
- [ ] **Renderer compatibility**: Ensure all stage content works with current renderer (code fences, chart arrows). Check for edge cases.
- [ ] **Build/test**: Run `npm run build` to ensure seed compiles and types are valid.

**Files:** `prisma/seed.ts`, `prisma/schema.prisma`

## 2) Tutor-Touchpoint Wiring (stage → tutor highlights)
**Objective:** Wire tutor highlighting so tutors can highlight a stage as part of response. Leverage existing schema (`TutorRequest`, `TutorSession`, `Message` with `stageId`).

### Current State
Schema has:
- `TutorRequest` with `stageId` (nullable)
- `Message` with `stageId` (nullable) 
- `TutorSession` relations

Need to understand full tutor UI flow. Check existing tutor components/routes.

### Tasks
- [ ] **Explore tutor implementation**: Find tutor dashboard/chat UI, API routes for tutor sessions/messages/requests
- [ ] **Stage page integration**: Add UI affordance on stage page to "Request tutor help" / tag stage for tutor. Consider `TutorRequest` creation.
- [ ] **Tutor highlighting**: When tutor sends message with `stageId`, ensure UI can highlight/reference that stage (maybe scroll to stage or show badge).
- [ ] **API wiring**: Ensure messages can be created with `stageId`. Check existing message APIs.
- [ ] **Permissions/UX**: Only show tutor help if tutor online? Schema has `User.isOnline`. Follow existing patterns.
- [ ] **Test flow**: Manual test - student requests help on stage, tutor responds with stage highlight.

**Files to investigate:** `src/app/tutor/**`, `src/components/tutor/**`, `src/app/api/tutor/**`, `src/app/courses/[courseId]/[moduleId]/[phaseId]/[stageId]/page.tsx`

## 3) IMAGE Stage Placeholder Handling
**Objective:** Improve IMAGE stage placeholder handling beyond current basic placeholder.

### Current State
In `StageContent` (line ~190-211 in stage page):
```tsx
case "IMAGE":
  return (
    <div className="mt-4 flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt={content} ... />
      ) : (
        <div className="h-64 w-full ...">No image available for this stage</div>
      )}
    </div>
  );
```

### Tasks
- [ ] **Review requirements**: "IMAGE stage placeholder handling — pending" - need better UX. Consider placeholder with instructions, upload flow, or better messaging.
- [ ] **Check uploads**: App uses local `public/uploads/` per requirements. Any upload API exists?
- [ ] **Improve placeholder**: Make placeholder more informative (stage title, expected image, instructions). Maybe show where to put image.
- [ ] **Seed data check**: Are there IMAGE stages in seed? Check seed.ts for type "IMAGE".
- [ ] **Graceful handling**: Ensure broken images have fallback. Consider alt text from content.
- [ ] **Optional**: Add upload UI if needed for tutor/admin, but must stay $0 budget (local storage).

**Files:** `src/app/courses/[courseId]/[moduleId]/[phaseId]/[stageId]/page.tsx`, check for upload routes in `src/app/api/**`

## Execution Order
1. **Audit first** - understand full picture, fix any issues found
2. **Tutor wiring** - core feature per requirements
3. **IMAGE handling** - polish

## Validation
- `npm run build` passes
- Manual test: navigate course, take quiz, test snippet grading
- Tutor flow works end-to-end
- IMAGE stages display properly

## Notes
- Don't modify git history
- Follow existing patterns (Tailwind, components/ui, etc.)
- Keep changes minimal and focused
- All changes must work with current dev server (port 3000)