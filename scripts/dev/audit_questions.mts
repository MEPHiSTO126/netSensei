import { db } from "../../src/lib/db";

const quizzes = await db.quiz.findMany({
  include: {
    phase: {
      select: {
        title: true,
        module: { select: { title: true } },
        stages: { select: { content: true } },
      },
    },
    questions: { orderBy: { order: "asc" } },
  },
});

const stop = new Set([
  "the","a","an","of","and","or","to","in","is","are","what","why","how","does","do","it","you","your","with","for","on","that","this","which","when","where","if","not","by","from","as","at","be","can","should","would","there","their","they","its","was","were","has","have","had","but","so","than","then","they","them","he","she","we","us","my","me","more","most","some","any","all","each","one","two","three","first","second","last","name","list","describe","explain","identify","compare","order","rank","write","make","define","state","check","set","use","using","shows","show","tell","give","given","after","before","over","under","into","out","up","down","about","because","while","when","where","which","whose","whom","how","why","what","very","too","also","only","both","same","other","another","new","old","good","bad","best","worst","better","worse","here","now","then","does","did","doing","done","being","been","am","let's","what's","don't","doesn't","isn't","won't","can't","it's","i'm","you're","they're","we're","isn't","wasn't","weren't","aren't","hasn't","haven't","hadn't","shouldn't","wouldn't","couldn't","must","need","needed","needs","want","wants","like","get","gets","got","go","goes","went","make","makes","made","take","takes","took","come","comes","came","see","sees","saw","know","knows","knew","think","thinks","thought","want","wants","need","needs","look","looks","looked","work","works","worked","call","calls","called","try","tries","tried","ask","asks","asked","seem","seems","felt","leave","leaves","left","put","puts","mean","means","meant","keep","keeps","kept","let","lets","begin","begins","began","seem","help","helps","helped","talk","talks","talked","turn","turns","turned","start","starts","started","might","may","must","shall","will","would","could","should","may","might","must","has","have","had","was","were","are","is","am","be","been","being","do","does","did","doing","done","go","goes","went","gone","come","comes","came","see","sees","saw","seen","know","knows","knew","known","think","thinks","thought","want","wants","wanted","need","needs","needed","like","likes","liked","get","gets","got","give","gives","gave","given","find","finds","found","tell","tells","told","ask","asks","asked","work","works","worked","call","calls","called","try","tries","tried","feel","feels","felt","leave","leaves","left","put","puts","mean","means","meant","keep","keeps","kept","let","lets","begin","begins","began","help","helps","helped","talk","talks","talked","turn","turns","turned","start","starts","started",
]);

function contentWords(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stop.has(w)),
  );
}

let index = 0;
const rows: string[] = [];

for (const quiz of quizzes) {
  const stageText = quiz.phase.stages.map((s) => s.content).join(" ");
  const stageWords = contentWords(stageText);

  for (const q of quiz.questions) {
    index += 1;
    const issues: string[] = [];
    const answer = (q.expectedAnswer ?? "").trim();

    if (!answer) issues.push("NO_ANSWER");
    if (answer.length > 220) issues.push("LONG_ANSWER");
    if (answer.length < 15 && answer.length > 0) issues.push("VERY_SHORT_ANSWER");

    const answerWords = contentWords(answer);
    const overlap = [...answerWords].filter((w) => stageWords.has(w)).length;
    const ratio = answerWords.size > 0 ? overlap / answerWords.size : 0;
    if (ratio < 0.4) issues.push(`LOW_CORRELATION_WITH_STAGE(${ratio.toFixed(2)})`);
    if (!q.fullGoal) issues.push("NO_GOAL");
    if (!q.rubric) issues.push("NO_RUBRIC");
    if (q.type === "SNIPPET" && !q.language) issues.push("NO_LANGUAGE");

    rows.push(
      [
        `#${index}`,
        `[${quiz.phase.module.title} > ${quiz.phase.title}]`,
        `type=${q.type}`,
        q.prompt,
        `ANSWER: ${answer}`,
        `GOAL: ${q.fullGoal ?? "-"}`,
        `RUBRIC: ${q.rubric ?? "-"}`,
        issues.length ? `ISSUES: ${issues.join(", ")}` : "ISSUES: none",
      ].join("\n"),
    );
  }
}

console.log(rows.join("\n\n"));
console.log(`\n=== TOTAL ${index} questions ===`);

await db.$disconnect();
