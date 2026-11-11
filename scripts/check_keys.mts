import { readFileSync } from "node:fs";

const source = readFileSync("prisma/quiz-content.ts", "utf8");

// Keys look like:  "Some prompt": {
const keys = [...source.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)].map((m) => m[1]);

console.log(`keys parsed: ${keys.length}`);
const seen = new Map<string, number>();
for (const key of keys) {
  seen.set(key, (seen.get(key) ?? 0) + 1);
}
const dupes = [...seen.entries()].filter(([, count]) => count > 1);
console.log(`duplicate keys in file: ${dupes.length}`);
for (const [key, count] of dupes) {
  console.log(`  x${count}  ${key}`);
}
