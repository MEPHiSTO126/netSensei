import { db } from "./db";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.1-8b-instant";

type GradeResult = {
  score: number; // 0-100
  feedback: string;
};

/**
 * Rule-based fallback grader. Used when Groq API key is missing or rate-limited.
 * Never crashes — always returns a sensible score and feedback.
 */
function ruleBasedGrade(
  questionType: "SNIPPET" | "TEXT" | "AUDIO",
  userAnswer: string,
  expectedAnswer: string | null,
  fullGoal: string | null
): GradeResult {
  const answer = (userAnswer || "").trim();
  const expected = (expectedAnswer || "").trim();
  const goal = (fullGoal || "").trim();

  if (!answer) {
    return { score: 0, feedback: "No answer provided." };
  }

  // --- Snippet grading: structure/keyword checks ---
  if (questionType === "SNIPPET") {
    let score = 0;
    const feedback: string[] = [];

    const lower = answer.toLowerCase();

    // Check for expected keywords
    if (expected) {
      const keywords = expected
        .split(/[,\s;]+/)
        .filter((k) => k.length > 2);
      const matched = keywords.filter((k) => lower.includes(k.toLowerCase()));
      const keywordScore =
        keywords.length > 0 ? (matched.length / keywords.length) * 50 : 25;
      score += keywordScore;
      if (matched.length === 0) {
        feedback.push(`Missing expected concepts: ${expected}`);
      } else {
        feedback.push(`Found key concepts: ${matched.join(", ")}`);
      }
    }

    // Check for full goal mention
    if (goal) {
      const goalWords = goal.split(/\s+/).filter((w) => w.length > 3);
      const goalMatched = goalWords.filter((w) => lower.includes(w.toLowerCase()));
      if (goalMatched.length > 0) {
        score += 25;
        feedback.push(`Addresses goal: ${goalMatched.join(", ")}`);
      }
    }

    // Basic structure checks
    if (answer.includes("function") || answer.includes("=>") || answer.includes("class")) {
      score += 15;
      feedback.push("Contains function or class definition");
    }
    if (answer.includes("{") && answer.includes("}")) {
      score += 10;
      feedback.push("Has proper code blocks");
    }

    return {
      score: Math.min(score, 100),
      feedback: feedback.join(" ") || "Code looks reasonable.",
    };
  }

  // --- Text / Audio grading: keyword overlap ---
  if (expected) {
    const expectedWords = expected
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const answerWords = answer.toLowerCase().split(/\s+/);
    const matched = expectedWords.filter((w) => answerWords.includes(w));
    const overlap = expectedWords.length > 0 ? matched.length / expectedWords.length : 0;
    const score = Math.round(Math.min(overlap * 100 + 20, 100));
    return {
      score,
      feedback: matched.length > 0
        ? `Covered ${matched.length}/${expectedWords.length} key terms.`
        : "Try to include more of the expected key terms.",
    };
  }

  // Fallback: length-based heuristic
  const lengthScore = Math.min(Math.round((answer.length / 100) * 100), 100);
  return {
    score: lengthScore,
    feedback:
      lengthScore > 50
        ? "Good effort. Consider reviewing the expected answer for completeness."
        : "Your answer is quite short. Try to expand with more detail.",
  };
}

/**
 * AI-powered grading via Groq (free tier), with rule-based fallback.
 * Always returns a result — never throws.
 */
export async function gradeAnswer({
  questionType,
  userAnswer,
  questionId,
}: {
  questionType: "SNIPPET" | "TEXT" | "AUDIO";
  userAnswer: string;
  questionId: string;
  studentId: string;
}): Promise<GradeResult> {
  const question = await db.question.findUnique({
    where: { id: questionId },
    select: { expectedAnswer: true, fullGoal: true, rubric: true },
  });

  if (!question) {
    return { score: 0, feedback: "Question not found." };
  }

  // Try Groq first if key is available
  if (GROQ_API_KEY) {
    try {
      const aiResult = await gradeWithGroq(
        questionType,
        userAnswer,
        question.expectedAnswer,
        question.fullGoal,
        question.rubric
      );
      if (aiResult) {
        return aiResult;
      }
    } catch {
      // fall through to fallback
    }
  }

  // Rule-based fallback
  return ruleBasedGrade(
    questionType,
    userAnswer,
    question.expectedAnswer,
    question.fullGoal
  );
}

async function gradeWithGroq(
  questionType: "SNIPPET" | "TEXT" | "AUDIO",
  userAnswer: string,
  expectedAnswer: string | null,
  fullGoal: string | null,
  rubric: string | null
): Promise<GradeResult | null> {
  const prompt = `
You are a coding tutor grading a student's answer. Be fair, encouraging, and concise.

Question type: ${questionType}
Expected answer: ${expectedAnswer || "Not specified"}
Full goal: ${fullGoal || "Not specified"}
Rubric: ${rubric || "Not specified"}

Student's answer:
${userAnswer}

Return ONLY a JSON object with two fields:
- score: integer 0-100
- feedback: short encouraging sentence (max 2 lines)

No markdown, no extra text.
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(content);
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      feedback: String(parsed.feedback || "Good effort!"),
    };
  } catch {
    return null;
  }
}

/**
 * AI-powered semantic code checking for snippet exercises.
 * Compares student code against the fullGoal.
 */
export async function checkSnippet({
  code,
  language,
  fullGoal,
}: {
  code: string;
  language: string;
  fullGoal: string | null;
  questionId: string;
  studentId: string;
}): Promise<GradeResult> {
  if (!fullGoal) {
    return ruleBasedGrade("SNIPPET", code, null, null);
  }

  if (GROQ_API_KEY) {
    try {
      const prompt = `
You are a coding tutor. Check if the student's ${language} code achieves this goal:

GOAL: ${fullGoal}

STUDENT CODE:
\`\`\`${language}
${code}
\`\`\`

Return ONLY JSON: {"score": 0-100, "feedback": "short encouraging sentence"}
No markdown, no extra text.
`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 200,
          }),
          signal: AbortSignal.timeout(10000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "{}";
        try {
          const parsed = JSON.parse(content);
          return {
            score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
            feedback: String(parsed.feedback || "Good effort!"),
          };
        } catch {
          // fall through
        }
      }
    } catch {
      // fall through
    }
  }

  return ruleBasedGrade("SNIPPET", code, null, fullGoal);
}
