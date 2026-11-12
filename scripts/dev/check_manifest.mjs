import fs from "node:fs";
import path from "node:path";

/**
 * Catches the mistakes that break a deploy before it even builds:
 *
 * - a dependency declared in package.json but missing from package-lock.json
 *   (or the other way round), which makes `npm ci` install a different tree
 * - an import in src/ that no declared dependency provides
 * - a package that the postinstall script needs but is not a dependency
 *
 * A deploy failed with exit code 127 because a hand-edited package.json had
 * dropped the prisma CLI, so `prisma generate` was not found. This script
 * turns that class of mistake into a local failure in under a second.
 */

const problems = [];

const manifest = JSON.parse(fs.readFileSync("package.json", "utf8"));
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));

const manifestDeps = manifest.dependencies ?? {};
const manifestDevDeps = manifest.devDependencies ?? {};
const lockRoot = lock.packages?.[""] ?? {};
const lockDeps = lockRoot.dependencies ?? {};
const lockDevDeps = lockRoot.devDependencies ?? {};

// 1. The lock file must describe the same dependency set as the manifest.
for (const [name, list] of [
  [lockDeps, manifestDeps],
  [lockDevDeps, manifestDevDeps],
]) {
  for (const depName of Object.keys(name)) {
    if (!list[depName]) {
      problems.push(
        `package-lock.json has "${depName}" but package.json does not. Run npm install.`,
      );
    }
  }
  for (const depName of Object.keys(list)) {
    if (!name[depName]) {
      problems.push(
        `package.json has "${depName}" but package-lock.json does not. Run npm install.`,
      );
    }
  }
}

// 2. Every external import in src/ must be provided by a declared dependency.
const provided = new Set([
  ...Object.keys(manifestDeps),
  ...Object.keys(manifestDevDeps),
]);
const builtin = new Set([
  "node:fs",
  "node:path",
  "node:crypto",
  "node:url",
  "node:child_process",
  "node:os",
  "node:process",
]);

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(full)) {
      const content = fs.readFileSync(full, "utf8");
      const pattern = /from\s+"([^"]+)"/g;
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const specifier = match[1];
        if (specifier.startsWith(".") || specifier.startsWith("@/")) continue;
        if (specifier.startsWith("node:")) continue;
        const pkgName = specifier.startsWith("@")
          ? specifier.split("/").slice(0, 2).join("/")
          : specifier.split("/")[0];
        if (!provided.has(pkgName)) {
          problems.push(
            `${full} imports "${specifier}" but "${pkgName}" is not in package.json`,
          );
        }
      }
    }
  }
}

if (fs.existsSync("src")) walk("src");

// 3. Anything the postinstall script runs has to be a dependency.
const postinstall = manifest.scripts?.postinstall ?? "";
const binaries = [...postinstall.matchAll(/\b([a-z][\w-]*)\s+(?:generate|install|migrate)\b/g)]
  .map((match) => match[1])
  .filter((name) => !["npx", "npm", "node"].includes(name));

for (const binary of binaries) {
  if (!provided.has(binary)) {
    problems.push(
      `postinstall runs "${binary}" but "${binary}" is not a dependency. It will fail with exit code 127 on deploy.`,
    );
  }
}

if (problems.length > 0) {
  console.error("Manifest check failed:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `Manifest check passed: ${Object.keys(manifestDeps).length} dependencies and ${Object.keys(manifestDevDeps).length} devDependencies, lock file in sync, imports resolved.`,
);
