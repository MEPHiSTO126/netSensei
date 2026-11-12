# Development scripts

Maintenance and verification tools for the netSensei course content. They are
not part of the app build.

Run them from the repository root with `npx tsx scripts/dev/<name>.mts`.

> **Data safety:** a learner's progress records are the product and cannot be
> recovered (Neon free tier has no point-in-time restore). Nothing in this
> folder deletes rows except `reset_course_content.mts`, which requires an
> explicit `--confirm` phrase. `npm run db:seed` is an upsert and is safe.

## Course content

| Script | What it does |
|---|---|
| `check_content.mts` | Integrity check: no empty phases, every phase has a quiz, every question has a key or an explanation, and image stages point at a file that exists. |
| `apply_quiz_content.mts` | Writes the multiple-choice options, key index, and explanation from `prisma/quiz-content.ts` onto existing questions. Idempotent. |
| `audit_mcq.mts` | Checks every keyed option against the original seeded answer: the key must overlap the reference answer more than any distractor does. Flags anything for manual review. |
| `check_mcq.mts` | Structural check: every MCQ has at least two options, an in-range key, an explanation, and no duplicated options. Also reports duplicate prompts. |
| `audit_questions.mts` | Content quality check: answers present, goals and rubrics present, and each answer correlated with its stage text. |
| `coverage.mts` | Per-module report of how many questions are multiple choice, open-ended, or still missing an answer key. |
| `dump_module.mts` | Prints the questions of one or more modules, for authoring answer keys. |
| `build_syllabus.mts` | Regenerates `docs/syllabus.md` from the live curriculum. |
| `db_status.mts` | Row counts, the account list, and the phase tree. |
| `diagnose_progress.mts` | Shows progress and answer records, including any that point at content that no longer exists. |

## Safety and verification

| Script | What it does |
|---|---|
| `verify_data_safety.mts` | Proves a learner's records survive the deploy pipeline. Run `setup`, then `npm run db:seed:production`, `npx prisma migrate deploy`, `npx prisma generate`, then `check`. |
| `verify_quiz_flow.mts` | End-to-end check of the quiz API: a student receives options but never the key, a tutor receives the key, a correct option scores 100 and a wrong one scores 0. Creates and removes a throwaway student. |
| `verify_mcq_keys.mts` | Grades every MCQ in one phase through the live API and asserts the key scores 100. Set `PHASE_ID`. |
| `verify_live.mts` | Calls the deployed site with signed sessions for a tutor and a throwaway student: the tutor must receive the answer key, the student must receive only the options, and only the student may submit. Uses a temporary account and removes it afterwards. |
| `check_migrations.mjs` | Fails if a migration contains destructive SQL. Runs automatically as part of `npm run build`. |
| `check_manifest.mjs` | Fails if package.json and package-lock.json disagree, if an import has no dependency, or if postinstall runs a binary that is not a dependency. Runs as part of `npm run build`. |
| `reset_course_content.mts` | The only script that deletes. `--progress <email> --confirm CLEAR-THIS-STUDENT` for one learner, `--content --confirm DELETE-CONTENT` for all course content. |

## Housekeeping

| Script | What it does |
|---|---|
| `cleanup_e2e.mts` | Removes any throwaway `e2e-*` accounts and the records they wrote. |
| `cleanup_leftovers.mts` | Removes leftover `safety-*` test accounts and lists the applied migrations. |
| `cleanup_live_test.mts` | Removes empty quiz attempts left by a verification run. |
| `remove_demo_users.mts` | Removes the demo accounts if they are ever seeded into production. |
| `tutor_session.mts` | Writes a temporary page that sets a tutor session cookie, so you can open the auth-protected tutor pages in a browser without logging in. Deletes nothing. |

Never commit `.env`. The scripts read it directly.

