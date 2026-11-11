import { db } from "../src/lib/db";

const title = process.argv[2] ?? "Selecting";
const phase = await db.phase.findFirstOrThrow({
  where: { title },
  select: { id: true, title: true },
});
console.log(phase.id);
await db.$disconnect();
