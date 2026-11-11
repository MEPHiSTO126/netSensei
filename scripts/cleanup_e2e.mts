import { db } from "../src/lib/db";

const temp = await db.user.findMany({
  where: { email: { startsWith: "e2e-" } },
  select: { id: true, email: true },
});

for (const user of temp) {
  await db.answerRecord.deleteMany({ where: { studentId: user.id } });
  await db.snippetAttempt.deleteMany({ where: { studentId: user.id } });
  await db.progressRecord.deleteMany({ where: { studentId: user.id } });
  await db.message.deleteMany({ where: { senderId: user.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log(`removed ${user.email}`);
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
