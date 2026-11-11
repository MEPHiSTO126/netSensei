import { db } from "../src/lib/db";

const p = await db.phase.findFirstOrThrow({
  where: { title: "Values and Types" },
  select: {
    id: true,
    moduleId: true,
    module: { select: { courseId: true } },
  },
});
console.log(`${p.module.courseId}|${p.moduleId}|${p.id}`);
await db.$disconnect();
