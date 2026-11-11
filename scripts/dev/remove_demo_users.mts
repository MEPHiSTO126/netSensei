import { db } from "../../src/lib/db";

const demoEmails = ["tutor@netsensei.local", "student@netsensei.local"];

for (const email of demoEmails) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`not present: ${email}`);
    continue;
  }

  await db.answerRecord.deleteMany({ where: { studentId: user.id } });
  await db.snippetAttempt.deleteMany({ where: { studentId: user.id } });
  await db.progressRecord.deleteMany({ where: { studentId: user.id } });
  await db.tutorRequest.deleteMany({ where: { studentId: user.id } });
  await db.message.deleteMany({ where: { senderId: user.id } });
  await db.tutorSession.deleteMany({ where: { studentId: user.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log(`removed demo account: ${email}`);
}

const remaining = await db.user.findMany({
  select: { email: true, role: true },
  orderBy: { role: "asc" },
});
console.log("\naccounts now:");
for (const user of remaining) {
  console.log(`  ${user.role.padEnd(7)} ${user.email}`);
}

await db.$disconnect();
