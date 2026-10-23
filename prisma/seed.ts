import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  console.log("🌱 Seeding database...");

  // Demo tutor
  const tutor = await db.user.upsert({
    where: { email: "tutor@netsensei.local" },
    update: {},
    create: {
      email: "tutor@netsensei.local",
      passwordHash: await hashPassword("tutor123"),
      role: "TUTOR",
    },
  });

  // Demo student
  const student = await db.user.upsert({
    where: { email: "student@netsensei.local" },
    update: {},
    create: {
      email: "student@netsensei.local",
      passwordHash: await hashPassword("student123"),
      role: "STUDENT",
    },
  });

  // Course
  const course = await db.course.upsert({
    where: { id: "course-frontend-v1" },
    update: {},
    create: {
      id: "course-frontend-v1",
      title: "Frontend Development",
      description:
        "Learn HTML, CSS, JavaScript, and React from scratch. Build real projects and get AI-powered feedback on your code.",
      order: 1,
      isPublished: true,
    },
  });

  // Modules
  const modules = [
    {
      title: "HTML & Semantic Markup",
      order: 1,
      phases: [
        {
          title: "HTML Basics",
          order: 1,
          stages: [
            { title: "Your First HTML Page", type: "TEXT", order: 1 },
            { title: "Headings, Paragraphs, and Lists", type: "TEXT", order: 2 },
            { title: "Links and Images", type: "IMAGE", order: 3 },
          ],
        },
        {
          title: "Semantic HTML",
          order: 2,
          stages: [
            { title: "Semantic Sectioning Elements", type: "TEXT", order: 1 },
            { title: "Forms and Input Validation", type: "TEXT", order: 2 },
          ],
        },
      ],
    },
    {
      title: "CSS & Styling",
      order: 2,
      phases: [
        {
          title: "CSS Basics",
          order: 1,
          stages: [
            { title: "CSS Selectors and Properties", type: "TEXT", order: 1 },
            { title: "The Box Model", type: "TEXT", order: 2 },
          ],
        },
      ],
    },
  ];

  for (const mod of modules) {
    const module = await db.module.create({
      data: {
        courseId: course.id,
        title: mod.title,
        order: mod.order,
      },
    });

    for (const phase of mod.phases) {
      const createdPhase = await db.phase.create({
        data: {
          moduleId: module.id,
          title: phase.title,
          order: phase.order,
        },
      });

      for (const stage of phase.stages) {
        await db.stage.create({
          data: {
            phaseId: createdPhase.id,
            title: stage.title,
            type: stage.type,
            content: `Content for ${stage.title}`,
            order: stage.order,
          },
        });
      }

      // Create quiz for the phase
      await db.quiz.create({
        data: {
          phaseId: createdPhase.id,
          mode: "NORMAL",
          passThreshold: 70,
          questions: {
            create: [
              {
                type: "TEXT",
                prompt: `What did you learn in ${phase.title}?`,
                expectedAnswer: "Key concepts from the phase",
                fullGoal: "Demonstrate understanding of phase concepts",
                order: 1,
                points: 1,
              },
            ],
          },
        },
      });
    }
  }

  console.log("✅ Seed complete");
  console.log(`   Tutor:    ${tutor.email} / tutor123`);
  console.log(`   Student:  ${student.email} / student123`);
  console.log(`   Course:   ${course.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
