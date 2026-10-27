import { db } from "./db";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.1-8b-instant";

type GradeResult = {
  score: number; // 0-100
  feedback: string;
};

const STOPWORDS = new Set(
  "a an the and or but if then than that this these those of to in on at by for with from into over under about after before while when where which who whom whose what why how is are was were be been being am do does did doing have has had having can could should would will may might must not no yes i me my we our you your he she it its they them their there here also just only very too so such as via use used using make makes made one two three all any each more most some few other own same new get gets got".split(
    " "
  )
);

// Common paraphrases in this course's vocabulary. Each group maps to one
// canonical word so "reused" and "reusable" count as the same idea.
const SYNONYM_GROUPS = [
  ["zero", "0"],
  ["shrink", "small", "reduce", "decrease", "contract"],
  ["grow", "large", "expand", "increase", "wide", "big"],
  ["set", "give", "apply", "assign"],
  ["list", "stack", "sequence", "series"],
  ["end", "finish", "terminate"],
  ["start", "begin", "initial"],
  ["create", "make", "produce", "generate"],
  ["show", "display", "draw", "paint"],
  ["pick", "select", "choose", "match"],
  ["hold", "contain", "store"],
  ["need", "require", "must"],
  ["run", "execute"],
  ["hard", "difficult", "tricky"],
  ["high", "strong"],
  ["across", "over", "through"],
  ["instead", "rather"],
  ["equal", "even", "same"],
  ["fix", "solve", "repair"],
  ["break", "fail"],
  ["move", "flow", "go"],
  ["inside", "within"],
  ["outside", "beyond"],
  ["fast", "quick"],
  ["remove", "delete", "drop"],
  ["avoid", "prevent", "skip"],
  ["keep", "retain", "preserve", "maintain"],
  ["change", "modify", "update"],
  ["read", "parse", "load"],
  ["write", "save", "persist"],
  ["size", "dimension"],
  ["space", "gap", "spacing"],
];

const CANONICAL = new Map<string, string>();
for (const group of SYNONYM_GROUPS) {
  for (const word of group) CANONICAL.set(word, group[0]);
}

const CODE_KEYWORDS = new Set(
  "function return const let var if else for while new class this true false null undefined async await import export default typeof".split(
    " "
  )
);

const CODE_TOKEN =
  /--[a-z0-9-]+|===|!==|==|!=|<=|>=|\*\*|=>|[%*+\-<>]|[a-z_$][a-z0-9_$-]*|#[0-9a-f]{3,8}|\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|vh|vw|fr|ch|deg)?/g;

function stem(word: string): string {
  for (const suffix of ["ing", "ed", "es", "s", "ly"]) {
    if (word.length > suffix.length + 3 && word.endsWith(suffix)) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}

function canonical(word: string): string {
  const stemmed = stem(word);
  return CANONICAL.get(stemmed) ?? CANONICAL.get(word) ?? stemmed;
}

function textTokens(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+(?:[-'][a-z0-9]+)*(?:\.[0-9]+)?/g) ?? [])
    .filter((word) => word.length > 2 && !STOPWORDS.has(word))
    .map(canonical);
}

function prefixMatch(a: string, b: string): boolean {
  const shorter = Math.min(a.length, b.length);
  let shared = 0;
  while (shared < shorter && a[shared] === b[shared]) shared++;
  return shared >= 4 && (shared === shorter || shared >= 5);
}

function wordsMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (prefixMatch(a, b)) return true;
  if (a.includes("-") || b.includes("-")) {
    return a.split("-").some((part) => b.split("-").some((other) => wordsMatch(part, other)));
  }
  return false;
}

function coverage(expected: string[], actual: string[]) {
  const uniqueExpected = [...new Set(expected)];
  const uniqueActual = [...new Set(actual)];
  const matched = uniqueExpected.filter((word) =>
    uniqueActual.some((other) => wordsMatch(word, other))
  );
  return {
    ratio: uniqueExpected.length > 0 ? matched.length / uniqueExpected.length : 0,
    matched,
    missing: uniqueExpected.filter((word) => !matched.includes(word)),
  };
}

// Grade a sentence by asking which of its clauses the answer covers, so a
// paraphrase is not punished for missing one word in a long explanation.
function clauses(text: string): string[][] {
  return text
    .split(/[.;:]\s+|,\s+(?=[a-z])/i)
    .map(textTokens)
    .filter((tokens) => tokens.length > 0);
}

function gradeText(answer: string, expected: string, goal: string): GradeResult {
  const answerTokens = textTokens(answer);
  if (answerTokens.length === 0) {
    return { score: 0, feedback: "No answer provided." };
  }

  if (!expected) {
    if (goal) {
      const goalCoverage = coverage(textTokens(goal), answerTokens);
      const score = Math.round(Math.pow(goalCoverage.ratio, 0.75) * 100);
      return {
        score,
        feedback:
          score >= 70
            ? "Good answer. You addressed the goal."
            : "Partly there. Say more about how and why it works.",
      };
    }
    const lengthScore = Math.min(Math.round((answer.length / 100) * 100), 100);
    return {
      score: lengthScore,
      feedback:
        lengthScore >= 70
          ? "Good effort. Consider reviewing the expected answer for completeness."
          : "Your answer is quite short. Try to expand with more detail.",
    };
  }

  const tokenCoverage = coverage(textTokens(expected), answerTokens);
  const clauseCoverage = clauses(expected);
  const coveredClauses = clauseCoverage.filter(
    (tokens) => coverage(tokens, answerTokens).ratio >= 0.4
  ).length;
  const clauseRatio = clauseCoverage.length > 0 ? coveredClauses / clauseCoverage.length : 0;
  const ratio = 0.45 * tokenCoverage.ratio + 0.55 * clauseRatio;
  const score = Math.round(Math.pow(Math.min(1, ratio * 1.08), 0.75) * 100);

  if (score >= 70) {
    return {
      score,
      feedback:
        tokenCoverage.missing.length === 0
          ? "Good answer. Every key idea is there."
          : `Good answer. You covered ${coveredClauses} of ${clauseCoverage.length} key ideas.`,
    };
  }

  const missing = tokenCoverage.missing.slice(0, 4).join(", ");
  const opener = score >= 40 ? "Partly there." : "Not quite.";
  return {
    score,
    feedback: missing
      ? `${opener} Revisit these ideas: ${missing}.`
      : `${opener} Add a sentence explaining how and why it works.`,
  };
}

function normalizeOperator(token: string): string {
  if (token === "**") return "*";
  if (token === "===") return "==";
  if (token === "!==") return "!=";
  return token;
}

function codeTokens(code: string): string[] {
  const tokens = (code.toLowerCase().match(CODE_TOKEN) ?? []).map(normalizeOperator);
  return [...new Set(tokens.filter((token) => !CODE_KEYWORDS.has(token)))];
}

function codeTokensMatch(a: string, b: string): boolean {
  if (a === b) return true;
  return a.length >= 5 && b.length >= 5 && (a.startsWith(b) || b.startsWith(a));
}

function gradeJavaScript(code: string, expected: string): GradeResult {
  const expectedTokens = codeTokens(expected);
  const actualTokens = codeTokens(code);
  const matched = expectedTokens.filter((token) =>
    actualTokens.some((other) => codeTokensMatch(token, other))
  );
  const ratio = expectedTokens.length > 0 ? matched.length / expectedTokens.length : 0;
  const hasStructure = /[{}]|=>/.test(code);
  const score = ratio === 0 ? 0 : Math.round(ratio * 90 + (hasStructure ? 10 : 0));
  const missing = expectedTokens.filter((token) => !matched.includes(token));

  return {
    score: Math.min(score, 100),
    feedback:
      score >= 70
        ? "Solid. The code covers the expected pieces."
        : `Not quite. Check for: ${missing.slice(0, 5).join(", ") || "the goal of the exercise"}.`,
  };
}

function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, " ");
}

type Declaration = { property: string; value: string };

function cssDeclarations(code: string): Declaration[] {
  const declarations: Declaration[] = [];
  const pattern = /(--[a-z0-9-]+|[a-z][a-z0-9-]*)\s*:\s*([^;{}]+)/gi;
  for (const match of stripComments(code).matchAll(pattern)) {
    let value = match[2].trim().toLowerCase().replace(/\s+/g, " ");
    while (
      value.endsWith(")") &&
      (value.match(/\)/g)?.length ?? 0) > (value.match(/\(/g)?.length ?? 0)
    ) {
      value = value.slice(0, -1).trim();
    }
    if (value) {
      declarations.push({ property: match[1].toLowerCase(), value });
    }
  }
  return declarations;
}

function cssSelectors(code: string): string[] {
  const selectors: string[] = [];
  for (const match of stripComments(code).matchAll(/(@?[^{}]+?)\s*\{/g)) {
    const selector = match[1].trim().toLowerCase().replace(/\s+/g, " ");
    if (selector && !selector.startsWith("@")) selectors.push(selector);
  }
  return [...new Set(selectors)];
}

function cssValueMatches(expected: string, actual: string): boolean {
  const expectedTokens = [...new Set(expected.match(CODE_TOKEN) ?? [])];
  const actualTokens = [...new Set(actual.match(CODE_TOKEN) ?? [])];
  if (expectedTokens.length === 0) return expectedTokens.length === actualTokens.length;
  return (
    expectedTokens.filter((token) => actualTokens.includes(token)).length /
      expectedTokens.length >=
    0.5
  );
}

function gradeCss(code: string, expected: string): GradeResult {
  const expectedDeclarations = cssDeclarations(expected);
  const actualDeclarations = cssDeclarations(code);
  const matched = expectedDeclarations.filter((declaration) =>
    actualDeclarations.some(
      (other) =>
        codeTokensMatch(other.property, declaration.property) &&
        cssValueMatches(declaration.value, other.value)
    )
  );
  const ratio =
    expectedDeclarations.length > 0 ? matched.length / expectedDeclarations.length : 0;
  const expectedSelectors = cssSelectors(expected);
  const actualSelectors = cssSelectors(code);
  const missingSelectors = expectedSelectors.filter(
    (selector) => !actualSelectors.some((other) => other.includes(selector))
  );

  let score = Math.round(ratio * 100);
  if (missingSelectors.length > 0) score = Math.min(score, 50);

  const missing = expectedDeclarations
    .filter((declaration) => !matched.includes(declaration))
    .map((declaration) => `${declaration.property}: ${declaration.value}`);

  return {
    score,
    feedback:
      score >= 70
        ? "Solid. The declarations match the goal."
        : `Not quite. Check: ${missing.slice(0, 4).join("; ") || "the selector and declarations"}.`,
  };
}

function gradeSnippet(code: string, expected: string, language: string): GradeResult {
  if (language.toLowerCase() === "css" && cssDeclarations(expected).length > 0) {
    return gradeCss(code, expected);
  }
  return gradeJavaScript(code, expected);
}

/**
 * Rule-based fallback grader. Used when the Groq key is missing or rate-limited.
 * Never crashes — always returns a sensible score and feedback.
 */
function ruleBasedGrade(
  questionType: "SNIPPET" | "TEXT" | "AUDIO",
  userAnswer: string,
  expectedAnswer: string | null,
  fullGoal: string | null,
  language = "javascript"
): GradeResult {
  const answer = (userAnswer || "").trim();
  const expected = (expectedAnswer || "").trim();
  const goal = (fullGoal || "").trim();

  if (!answer) {
    return { score: 0, feedback: "No answer provided." };
  }

  if (questionType === "SNIPPET") {
    if (expected) return gradeSnippet(answer, expected, language);
    if (goal) {
      const goalCoverage = coverage(textTokens(goal), textTokens(answer));
      const score = Math.round(Math.pow(goalCoverage.ratio, 0.75) * 100);
      return {
        score,
        feedback:
          score >= 70
            ? "The code looks reasonable. Compare it with the goal once more."
            : "The code misses part of the goal. Re-read the exercise and try again.",
      };
    }
    const hasStructure = /[{}]|=>/.test(answer);
    return {
      score: hasStructure ? 60 : 20,
      feedback: "Add the missing structure, then compare the result with the goal.",
    };
  }

  return gradeText(answer, expected, goal);
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
  questionId,
}: {
  code: string;
  language: string;
  fullGoal: string | null;
  questionId: string;
  studentId: string;
}): Promise<GradeResult> {
  const question = await db.question.findUnique({
    where: { id: questionId },
    select: { expectedAnswer: true, fullGoal: true, language: true },
  });

  const expected = question?.expectedAnswer ?? null;
  const goal = fullGoal ?? question?.fullGoal ?? null;
  const effectiveLanguage = language || question?.language || "javascript";

  if (!goal && !expected) {
    return ruleBasedGrade("SNIPPET", code, null, null, effectiveLanguage);
  }

  if (GROQ_API_KEY) {
    try {
      const prompt = `
You are a coding tutor. Check if the student's ${effectiveLanguage} code achieves this goal:

GOAL: ${goal || "Not specified"}
EXPECTED ANSWER: ${expected || "Not specified"}

STUDENT CODE:
\`\`\`${effectiveLanguage}
${code}
\`\`\`

Treat other correct approaches as valid; the expected answer is one example, not the only one.
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

  return ruleBasedGrade("SNIPPET", code, expected, goal, effectiveLanguage);
}
