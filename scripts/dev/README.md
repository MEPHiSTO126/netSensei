# Development scripts

Maintenance and verification tools for the netSensei course content. They are
not part of the app build.

Run them from the repository root with `npx tsx scripts/dev/<name>.mts`.

## Course content

| Script | What it does |
|---|---|
| `sync_content.mts` | Applies the seed curriculum to the database **without deleting anything**. Creates missing modules, phases, stages, quizzes, and questions, and refreshes answer keys on questions that already exist. Safe to run against production. |
| `apply_quiz_content.mts` | Writes the multiple-choice options, key index, and explanation from `prisma/quiz-content.ts` onto existing questions. Idempotent. |
| `audit_mcq.mts` | Checks every keyed option against the original seeded answer: the key must overlap the reference answer more than any distractor does. Flags anything for manual review. |
| `check_mcq.mts` | Structural check: every MCQ has at least two options, an in-range key, an explanation, and no duplicated options. Also reports duplicate prompts. |
| `audit_questions.mts` | Content quality check: answers present, goals and rubrics present, and each answer correlated with its stage text. |
| `coverage.mts` | Per-module report of how many questions are multiple choice, open-ended, or still missing an answer key. |
| `dump_module.mts` | Prints the questions of one or more modules, for authoring answer keys. |
| `build_syllabus.mts` | Regenerates `docs/syllabus.md` from the live curriculum. |
| `db_status.mts` | Row counts, the account list, and the phase tree. |

## Verification

| Script | What it does |
|---|---|
| `verify_quiz_flow.mts` | End-to-end check of the quiz API: a student receives options but never the key, a tutor receives the key, a correct option scores 100 and a wrong one scores 0. Creates and removes a throwaway student. |
| `verify_mcq_keys.mts` | Grades every MCQ in one phase through the live API and asserts the key scores 100. Set `PHASE_ID`. |

## Housekeeping

| Script | What it does |
|---|---|
| `cleanup_e2e.mts` | Removes any throwaway `e2e-*` accounts and the records they wrote. |
| `remove_demo_users.mts` | Removes the demo accounts if they are ever seeded into production. |

Never commit `.env`. The scripts read it directly.
