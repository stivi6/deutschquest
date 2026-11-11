import { describe, it, expect, beforeEach } from "vitest";
import { exercises } from "@/data/exercises";
import {
  category,
  evaluate,
  freshProgress,
  saveAttempt,
  summary,
  status,
  validateProgress,
  readProgress,
  writeProgress,
  resetStoredProgress,
  STORAGE_KEY,
} from "./logic";
const answers = (id: string) =>
  exercises
    .find((e) => e.id === id)
    ?.prompts.map((p) => ({ submitted: p.answer, correct: true })) || [];
describe("DeutschQuest rules", () => {
  beforeEach(() => localStorage.clear());
  it("contains 3 chapters, exactly 5 exercises each and 45 scored prompts", () => {
    expect(exercises.length).toBe(15);
    for (let c = 0; c < 3; c++) expect(exercises.filter((e) => e.chapter === c).length).toBe(5);
    expect(exercises.flatMap((e) => e.prompts).length).toBe(45);
  });
  it("awards one point per correct answer, never more than 45", () => {
    let p = freshProgress();
    for (const e of exercises) p = saveAttempt(p, e.id, answers(e.id));
    expect(summary(p)).toMatchObject({
      total: 45,
      percentage: 100,
      completed: 15,
      chapterScores: [15, 15, 15],
      strongest: 0,
    });
  });
  it("keeps the best attempt and its answers without counting repeats", () => {
    let p = saveAttempt(freshProgress(), "c1-e1", answers("c1-e1"));
    p = saveAttempt(p, "c1-e1", [
      { submitted: "wrong", correct: false },
      ...answers("c1-e1").slice(1),
    ]);
    expect(p.exercises["c1-e1"]).toMatchObject({ bestCorrect: 3, attempts: 2 });
    expect(summary(p).total).toBe(3);
    expect(p.exercises["c1-e1"]?.answers[0]?.correct).toBe(true);
  });
  it("starts with only exercise one available and unlocks sequentially", () => {
    let p = freshProgress();
    expect(status(p, "c1-e1")).toBe("available");
    expect(status(p, "c1-e2")).toBe("locked");
    p = saveAttempt(p, "c1-e1", answers("c1-e1"));
    expect(status(p, "c1-e1")).toBe("completed");
    expect(status(p, "c1-e2")).toBe("available");
    expect(status(p, "c2-e1")).toBe("locked");
    for (const e of exercises.slice(1, 5)) p = saveAttempt(p, e.id, answers(e.id));
    expect(status(p, "c2-e1")).toBe("available");
    expect(status(p, "c3-e1")).toBe("locked");
    for (const e of exercises.slice(5, 10)) p = saveAttempt(p, e.id, answers(e.id));
    expect(status(p, "c3-e1")).toBe("available");
  });
  it.each([
    [49, "Beginner Adventurer"],
    [50, "Language Learner"],
    [74, "Language Learner"],
    [75, "German Explorer"],
    [89, "German Explorer"],
    [90, "Sprachprofi"],
  ])("evaluates %s percent as %s", (percent, title) =>
    expect(category(Number(percent)).title).toBe(title),
  );
  it("ignores repeated spaces and optional final stop but preserves capitalization and umlauts", () => {
    expect(evaluate("  Ich  lerne Deutsch", "Ich lerne Deutsch.")).toBe(true);
    expect(evaluate("ich lerne Deutsch.", "Ich lerne Deutsch.")).toBe(false);
    expect(evaluate("grun", "grün")).toBe(false);
  });
  it("safely recovers malformed and invalid storage", () => {
    localStorage.setItem(STORAGE_KEY, "{bad");
    expect(summary(readProgress()).completed).toBe(0);
    expect(summary(validateProgress({ version: 2 })).completed).toBe(0);
    expect(
      summary(
        validateProgress({
          version: 1,
          exercises: { "c1-e1": { completed: true, bestCorrect: 45 } },
        }),
      ).total,
    ).toBe(0);
  });
  it("persists results and resets only its own key", () => {
    const p = saveAttempt(freshProgress(), "c1-e1", answers("c1-e1"));
    writeProgress(p);
    expect(readProgress().exercises["c1-e1"]?.bestCorrect).toBe(3);
    localStorage.setItem("other", "keep");
    resetStoredProgress();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
    expect(localStorage.getItem("other")).toBe("keep");
  });
});
