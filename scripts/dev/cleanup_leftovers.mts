import { db } from "../../src/lib/db";

const applied = await db.$queryRawUnsafe<{ migration_name: string; finished_at: Date | null }[]>(
  'SELECT migration_name, finished_at FROM "_prisma_migrations" ORDER BY finished_at DESC LIMIT 5',
);

console.log("recent migrations:");
for (const row of applied) {
  console.log(`  ${row.migration_name} · ${row.finished_at ? row.finished_at.toISOString() : "PENDING"}`);
}

const leftovers = await db.user.findMany({
  where: { email: { startsWith: "safety-" } },
  select: { id: true, email: true },
});

for (const user of leftovers) {
  await db.answerRecord.deleteMany({ where: { studentId: user.id } });
  await db.progressRecord.deleteMany({ where: { studentId: user.id } });
  await db.snippetAttempt.deleteMany({ where: { studentId: user.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log(`removed leftover test account ${user.email}`);
}

const accounts = await db.user.findMany({
  select: { email: true, role: true },
  orderBy: { role: "asc" },
});
console.log("\naccounts now:");
for (const account of accounts) {
  console.log(`  ${account.role.padEnd(7)} ${account.email}`);
}

await db.$disconnect();
