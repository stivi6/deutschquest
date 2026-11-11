import { exercises } from "@/data/exercises";
export const STORAGE_KEY = "deutschquest:progress:v1";
export type Answer = { submitted: string; correct: boolean };
export type RecordProgress = {
  completed: true;
  bestCorrect: number;
  attempts: number;
  answers: Answer[];
};
export type Progress = {
  version: 1;
  exercises: Record<string, RecordProgress>;
  lastVisitedExerciseId: string | null;
  updatedAt: string;
};
export const freshProgress = (): Progress => ({
  version: 1,
  exercises: {},
  lastVisitedExerciseId: null,
  updatedAt: new Date().toISOString(),
});
export function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/\.$/, "");
}
export function evaluate(submitted: string, expected: string) {
  return normalize(submitted) === normalize(expected);
}
export function validateProgress(value: unknown): Progress {
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 1 ||
    !("exercises" in value) ||
    !value.exercises ||
    typeof value.exercises !== "object" ||
    Array.isArray(value.exercises)
  )
    return freshProgress();
  const safe = freshProgress();
  for (const ex of exercises) {
    const record: unknown = (value.exercises as Record<string, unknown>)[ex.id];
    if (
      !record ||
      typeof record !== "object" ||
      !("completed" in record) ||
      record.completed !== true ||
      !("bestCorrect" in record) ||
      typeof record.bestCorrect !== "number" ||
      !Number.isInteger(record.bestCorrect) ||
      record.bestCorrect < 0 ||
      record.bestCorrect > 3 ||
      !("attempts" in record) ||
      typeof record.attempts !== "number" ||
      !Number.isInteger(record.attempts) ||
      record.attempts < 1 ||
      !("answers" in record) ||
      !Array.isArray(record.answers) ||
      record.answers.length !== 3
    )
      continue;
    const answers: Answer[] = [];
    for (const [i, a] of record.answers.entries()) {
      if (
        !a ||
        typeof a !== "object" ||
        typeof a.submitted !== "string" ||
        typeof a.correct !== "boolean"
      )
        break;
      const prompt = ex.prompts[i];
      if (!prompt || evaluate(a.submitted, prompt.answer) !== a.correct) break;
      answers.push({ submitted: a.submitted, correct: a.correct });
    }
    if (answers.length !== 3 || answers.filter((a) => a.correct).length !== record.bestCorrect)
      continue;
    safe.exercises[ex.id] = {
      completed: true,
      bestCorrect: record.bestCorrect,
      attempts: record.attempts,
      answers,
    };
  }
  if (
    "lastVisitedExerciseId" in value &&
    typeof value.lastVisitedExerciseId === "string" &&
    exercises.some((e) => e.id === value.lastVisitedExerciseId)
  )
    safe.lastVisitedExerciseId = value.lastVisitedExerciseId;
  return safe;
}
export function readProgress(): Progress {
  try {
    return validateProgress(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
  } catch {
    return freshProgress();
  }
}
export function writeProgress(progress: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
export function resetStoredProgress(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
export function saveAttempt(progress: Progress, id: string, answers: Answer[]): Progress {
  if (!exercises.some((e) => e.id === id) || answers.length !== 3) return progress;
  const previous = progress.exercises[id];
  const correct = answers.filter((a) => a.correct).length;
  const best =
    previous && previous.bestCorrect >= correct
      ? previous
      : { completed: true as const, bestCorrect: correct, answers };
  return {
    ...progress,
    updatedAt: new Date().toISOString(),
    exercises: {
      ...progress.exercises,
      [id]: { ...best, attempts: (previous?.attempts || 0) + 1 },
    },
  };
}
export function status(progress: Progress, id: string): "completed" | "available" | "locked" {
  const index = exercises.findIndex((e) => e.id === id);
  if (index < 0) return "locked";
  if (progress.exercises[id]?.completed) return "completed";
  if (index === 0) return "available";
  const ex = exercises[index];
  if (
    index % 5 === 0 &&
    ex &&
    exercises.slice(0, index).some((e) => !progress.exercises[e.id]?.completed)
  )
    return "locked";
  const prev = exercises[index - 1];
  return prev && progress.exercises[prev.id]?.completed ? "available" : "locked";
}
export function summary(progress: Progress) {
  const completed = exercises.filter((e) => progress.exercises[e.id]?.completed).length;
  const chapterScores = [0, 1, 2].map((chapter) =>
    exercises
      .filter((e) => e.chapter === chapter)
      .reduce((s, e) => s + (progress.exercises[e.id]?.bestCorrect || 0), 0),
  );
  const total = chapterScores.reduce((a, b) => a + b, 0);
  return {
    completed,
    chapterScores,
    total,
    percentage: Math.round((total / 45) * 100),
    strongest: chapterScores.indexOf(Math.max(...chapterScores)),
  };
}
export function category(percent: number) {
  if (percent >= 90)
    return {
      title: "Profesionist i gjermanishtes",
      comment: "Punë e shkëlqyer! E ke trajtuar me siguri dhe saktësi çdo sfidë.",
    };
  if (percent >= 75)
    return {
      title: "Eksplorues i gjermanishtes",
      comment: "Punë e mirë! Po ndërton një themel të fortë në gjermanisht.",
    };
  if (percent >= 50)
    return {
      title: "Nxënës i gjuhës",
      comment: "Përparim i mirë! Vazhdoni të praktikoni dhe fjalët do të bëhen më të njohura.",
    };
  return {
    title: "Aventurier fillestar",
    comment: "Çdo aventurë fillon diku. Rishiko gabimet dhe provo përsëri!",
  };
}
