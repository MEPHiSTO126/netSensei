import fs from "node:fs";
import path from "node:path";

/**
 * Fails if a migration contains SQL that destroys data. Migrations run on
 * deploy, so a stray DROP or TRUNCATE in one of them would wipe a learner's
 * records without anyone running a script.
 */

const DESTRUCTIVE = [
  /\bDROP\s+TABLE\b/i,
  /\bTRUNCATE\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bDROP\s+COLUMN\b/i,
  /\bDROP\s+DATABASE\b/i,
];

const migrationsDir = path.join("prisma", "migrations");
const offenders = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith(".sql")) {
      const sql = fs.readFileSync(full, "utf8");
      for (const pattern of DESTRUCTIVE) {
        if (pattern.test(sql)) {
          offenders.push(`${full} matches ${pattern}`);
        }
      }
    }
  }
}

if (!fs.existsSync(migrationsDir)) {
  console.log("Migration safety check passed: no migrations directory.");
  process.exit(0);
}

walk(migrationsDir);

if (offenders.length > 0) {
  console.error("Destructive statements found in migrations:");
  for (const offender of offenders) console.error(`  - ${offender}`);
  console.error(
    "\nMigrations run on deploy. Use additive changes only, or do the work in a script under scripts/dev/ that asks for confirmation.",
  );
  process.exit(1);
}

console.log("Migration safety check passed: no destructive statements.");
