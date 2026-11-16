/**
 * Glossary helpers.
 *
 * The matcher lives here, separately from the glossary data, so that the
 * client component can import it without pulling the whole glossary into the
 * browser bundle. The data lives in `src/data/glossary.ts`.
 */

export type GlossaryEntry = {
  /** The term as a learner first meets it. */
  term: string;
  /** Plain language, one or two sentences, no jargon of its own. */
  explanation: string;
  /** The module the term is introduced in. */
  module: string;
  /** The stage the term is introduced in. */
  stage: string;
  /** Other surface forms of the same term. */
  aliases?: string[];
};

export type GlossarySegment = {
  text: string;
  /** The entry this run of text refers to, or null for ordinary text. */
  entry: GlossaryEntry | null;
};

const SUFFIX = "(?:s|es|ed|ing|d|ly)?";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Builds the pattern for one entry. The suffix allows the same word to be
 * caught in a different grammatical form ("promises", "asynchronously").
 *
 * There is deliberately no lookbehind here. Safari before 16.4 throws a
 * SyntaxError on `(?<!...)`, and a thrown error in the matcher would take
 * the whole stage page down. The character in front of a match is checked
 * by hand in `splitByGlossaryTerms` instead.
 */
export function buildGlossaryPattern(entry: GlossaryEntry): RegExp {
  const forms = [entry.term, ...(entry.aliases ?? [])];
  const alternatives = forms.map(escapeRegExp).join("|");
  return new RegExp(`(${alternatives})${SUFFIX}(?![\\w-])`, "gi");
}

/**
 * Splits a piece of text into ordinary runs and glossary matches.
 *
 * When two entries overlap — `aria-live` and `aria`, say — the longer term
 * wins, so the specific match is never broken up by the general one.
 */
export function splitByGlossaryTerms(
  text: string,
  entries: GlossaryEntry[],
): GlossarySegment[] {
  if (!entries.length || !text) return [{ text, entry: null }];

  type Candidate = { start: number; end: number; entry: GlossaryEntry };
  const candidates: Candidate[] = [];

  for (const entry of entries) {
    const pattern = buildGlossaryPattern(entry);
    let match = pattern.exec(text);
    while (match !== null) {
      // The character in front of the term decides whether it is a word of
      // its own or the tail of a longer name: "memo" in "useMemo" is not a
      // mention of "memo".
      const before = text.charAt(match.index - 1);
      if (!before || !/[\w$@]/.test(before)) {
        candidates.push({
          start: match.index,
          end: match.index + match[0].length,
          entry,
        });
      }
      if (match.index === pattern.lastIndex) pattern.lastIndex += 1;
      match = pattern.exec(text);
    }
  }

  // Longest term first, so a specific term always beats a shorter one that
  // starts inside it.
  candidates.sort(
    (a, b) => b.entry.term.length - a.entry.term.length || a.start - b.start,
  );

  const accepted: Candidate[] = [];
  for (const candidate of candidates) {
    const overlaps = accepted.some(
      (a) => candidate.start < a.end && a.start < candidate.end,
    );
    if (!overlaps) accepted.push(candidate);
  }
  accepted.sort((a, b) => a.start - b.start);

  const segments: GlossarySegment[] = [];
  let cursor = 0;
  for (const match of accepted) {
    if (match.start > cursor) {
      segments.push({ text: text.slice(cursor, match.start), entry: null });
    }
    segments.push({ text: text.slice(match.start, match.end), entry: match.entry });
    cursor = match.end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), entry: null });
  }
  return segments;
}
