<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Data safety rules (read before touching the database)

A learner's progress records are the product. Losing them is unrecoverable:
Neon on the free tier has no point-in-time restore.

**Never write to the production database in a way that deletes rows.**

- `npm run db:seed` is an **upsert**. It creates what is missing and updates
  what exists, matched by title and prompt. It never deletes, and it keeps
  phase and question ids stable, so progress records stay attached to the
  right lesson. It is safe to run against production.
- The only script that deletes course content or learner records is
  `scripts/dev/reset_course_content.mts`. It prints exactly what it will
  remove and refuses to run without an explicit `--confirm` phrase.
- Migrations run on every deploy, so they must be **additive only**
  (`ADD COLUMN`, `CREATE TABLE`, `CREATE INDEX`). `npm run build` runs
  `scripts/dev/check_migrations.mjs` and fails the build if a migration
  contains `DROP`, `TRUNCATE`, `DELETE FROM`, or `DROP COLUMN`.
- `prisma/seed.ts` only executes when it is run directly. Importing it to
  read the curriculum is safe, and the content write is retried so a dropped
  connection cannot leave the course half applied.
- Demo accounts (`student@netsensei.local`, `tutor@netsensei.local`) are
  opt-in with `--with-demo-users`. They must never exist in production.

**Before running anything against the live database**, check what it does:

```bash
npx tsx scripts/dev/db_status.mts          # what exists right now
npx tsx scripts/dev/verify_data_safety.mts setup   # writes a throwaway record
npm run db:seed:production                  # the pipeline step
npx tsx scripts/dev/verify_data_safety.mts check   # asserts nothing was lost
```

**Content changes** belong in `prisma/seed.ts` (course content) and
`prisma/quiz-content.ts` (answer keys and explanations). After editing them,
apply with `npm run db:seed:production` and `npm run content:quiz-keys`.
