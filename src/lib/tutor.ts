const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Short, human time since an event, e.g. "6m ago". */
export function formatRelative(value: Date, now = new Date()): string {
  const elapsed = Math.max(0, now.getTime() - value.getTime());

  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}d ago`;

  return value.toLocaleDateString(undefined, { dateStyle: "medium" });
}

/** How long a student has been waiting, e.g. "6 min". */
export function formatWait(value: Date, now = new Date()): string {
  const elapsed = Math.max(0, now.getTime() - value.getTime());

  if (elapsed < MINUTE) return "under a minute";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} min`;
  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    const minutes = Math.floor((elapsed % HOUR) / MINUTE);
    return `${hours} hr ${minutes} min`;
  }

  return `${Math.floor(elapsed / DAY)} d`;
}

export function latestDate(
  ...values: Array<Date | null | undefined>
): Date | null {
  let latest: Date | null = null;
  for (const value of values) {
    if (value && (!latest || value > latest)) latest = value;
  }
  return latest;
}

export type ProgressSummary = {
  attempted: number;
  passed: number;
  average: number;
};

type ProgressLike = {
  phaseId: string;
  passed: boolean;
  score: number;
};

/** Collapses attempt rows into one best result per phase. */
export function summariseProgress(
  records: ProgressLike[],
): ProgressSummary {
  const byPhase = new Map<string, { passed: boolean; score: number }>();

  for (const record of records) {
    const previous = byPhase.get(record.phaseId);
    byPhase.set(record.phaseId, {
      passed: (previous?.passed ?? false) || record.passed,
      score: Math.max(previous?.score ?? 0, record.score),
    });
  }

  let passed = 0;
  let totalScore = 0;
  for (const phase of byPhase.values()) {
    if (phase.passed) passed += 1;
    totalScore += phase.score;
  }

  return {
    attempted: byPhase.size,
    passed,
    average:
      byPhase.size > 0 ? Math.round(totalScore / byPhase.size) : 0,
  };
}
