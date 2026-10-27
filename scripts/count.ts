import { db } from "../src/lib/db";
async function main() {
  console.log("modules", await db.module.count(), "phases", await db.phase.count(), "stages", await db.stage.count(), "questions", await db.question.count(), "users", await db.user.count(), "course", await db.course.count());
  await db.$disconnect();
}
main();
