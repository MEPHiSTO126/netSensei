import { db } from "../../src/lib/db";

const recent = await db.answerRecord.findMany({
  orderBy: { createdAt: "desc" },
  take: 8,
  select: {
    id: true,
    content: true,
    score: true,
    createdAt: true,
    student: { select: { email: true } },
    question: { select: { prompt: true } },
  },
});

console.log(`total answer records in the database: ${await db.answerRecord.count()}`);
console.log(`total progress records: ${await db.progressRecord.count()}\n`);

for (const record of recent) {
  console.log(
    `${record.createdAt.toISOString()}  ${record.student.email}  score=${record.score}  "${record.question.prompt.slice(0, 45)}"`,
  );
}

await db.$disconnect();
