import { db } from "../../src/lib/db";

const stop = new Set([
  "the", "a", "an", "of", "and", "or", "to", "in", "is", "are", "what", "why",
  "how", "does", "do", "it", "you", "your", "with", "for", "on", "that", "this",
  "which", "when", "where", "if", "not", "by", "from", "as", "at", "be", "can",
  "should", "would", "there", "their", "they", "its", "was", "were", "has",
  "have", "had", "but", "so", "than", "then", "he", "she", "we", "us", "my",
  "me", "more", "most", "some", "any", "all", "each", "one", "two", "three",
  "first", "second", "last", "name", "list", "describe", "explain", "identify",
  "compare", "order", "rank", "write", "make", "define", "state", "check", "set",
  "use", "using", "shows", "show", "tell", "give", "given", "after", "before",
  "over", "under", "into", "out", "up", "down", "about", "because", "while",
  "like", "get", "gets", "got", "go", "goes", "went", "take", "takes", "took",
  "come", "comes", "came", "see", "sees", "saw", "know", "knows", "knew",
  "think", "thinks", "thought", "want", "wants", "need", "needs", "look",
  "looks", "looked", "work", "works", "worked", "call", "calls", "called",
  "try", "tries", "tried", "ask", "asks", "asked", "seem", "seems", "felt",
  "leave", "leaves", "left", "put", "puts", "mean", "means", "meant", "keep",
  "keeps", "kept", "let", "lets", "begin", "begins", "began", "help", "helps",
  "helped", "talk", "talks", "talked", "turn", "turns", "turned", "start",
  "starts", "started", "might", "may", "must", "shall", "will", "would",
  "could", "need", "needed", "want", "wants", "find", "finds", "found", "give",
  "gives", "gave", "mean", "means", "meant", "keep", "keeps", "kept", "let",
  "lets", "begin", "begins", "began", "help", "helps", "helped", "talk",
  "talks", "talked", "turn", "turns", "turned", "start", "starts", "started",
  "returns", "return", "runs", "run", "run", "passes", "pass", "gives",
  "gives", "works", "work", "works", "happens", "happen", "makes", "make",
]);

function words(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stop.has(w)),
  );
}

const allQuestions = await db.question.findMany({
  select: {
    prompt: true,
    expectedAnswer: true,
    options: true,
    correctIndex: true,
    explanation: true,
    quiz: { select: { phase: { select: { title: true } } } },
  },
});

const questions = allQuestions.filter(
  (question) => Array.isArray(question.options) && question.options.length > 0,
);

let flagged = 0;

for (const question of questions) {
  const options = question.options as string[];
  const key = options[question.correctIndex ?? 0];
  const keyWords = words(key);
  const answerWords = words(question.expectedAnswer ?? "");

  const shared = [...keyWords].filter((w) => answerWords.has(w)).length;
  const overlap = keyWords.size > 0 ? shared / keyWords.size : 0;

  // Each distractor should share far fewer words with the reference answer.
  const distractorOverlaps = options
    .filter((_, index) => index !== question.correctIndex)
    .map((option) => {
      const optionWords = words(option);
      const hits = [...optionWords].filter((w) => answerWords.has(w)).length;
      return optionWords.size > 0 ? hits / optionWords.size : 0;
    });

  const bestDistractor = Math.max(...distractorOverlaps);

  if (overlap < 0.35 || bestDistractor > overlap) {
    flagged += 1;
    console.log(
      `CHECK  [${question.quiz.phase.title}] ${question.prompt.slice(0, 60)}`,
    );
    console.log(`        key overlap=${overlap.toFixed(2)} bestDistractor=${bestDistractor.toFixed(2)}`);
    console.log(`        key: ${key.slice(0, 90)}`);
    console.log(`        ref: ${(question.expectedAnswer ?? "").slice(0, 90)}`);
  }
}

console.log(`\nMCQ questions: ${questions.length}`);
console.log(`flagged for manual review: ${flagged}`);

await db.$disconnect();
