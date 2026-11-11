import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Lightbulb,
  Trophy,
  LockKeyhole,
  Flag,
} from "lucide-react";
import { SiteLayout, ProgressBar } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { ExerciseInteraction } from "@/components/ExerciseInteraction";
import { chapters, exercises, type Exercise } from "@/data/exercises";
import { useGame } from "@/game/progress";
import { evaluate, status, summary, type Answer } from "@/game/logic";
import { pageHead } from "@/game/meta";
export const Route = createFileRoute("/play/$exerciseId")({
  head: ({ params }) =>
    pageHead(
      exercises.find((e) => e.id === params.exerciseId)?.title || "Sfida e padisponueshme",
      "Ushtro gjermanisht me tre pyetje të shkurtra interaktive. Plotëso sfidën dhe vazhdo udhëtimin e të mësuarit.",
    ),
  component: ExerciseRoute,
});
function ExerciseRoute() {
  const { exerciseId } = Route.useParams();
  const { progress, ready } = useGame();
  const exercise = exercises.find((e) => e.id === exerciseId);
  if (!ready)
    return (
      <SiteLayout>
        <main className="loading-state">Po ngarkohet sfida jote…</main>
      </SiteLayout>
    );
  if (!exercise || status(progress, exerciseId) === "locked")
    return (
      <SiteLayout>
        <main className="container page-main complete-view">
          <div className="achievement">
            <LockKeyhole />
          </div>
          <h1>{exercise ? "Kjo sfidë është e mbyllur" : "Sfida nuk u gjet"}</h1>
          <p className="page-subtitle">
            {exercise
              ? "Plotëso sfidat e mëparshme për të arritur këtë pikë kontrolli."
              : "Ky pikë kontrolli nuk është pjesë e udhëtimit tuaj."}
          </p>
          <div className="complete-actions">
            <Button asChild variant="cta" size="quest">
              <Link to="/play">
                Kthehu te rruga e udhëtimit <ArrowRight />
              </Link>
            </Button>
          </div>
        </main>
      </SiteLayout>
    );
  return <Attempt key={exercise.id} exercise={exercise} />;
}
function Attempt({ exercise }: { exercise: Exercise }) {
  const { progress, finish, visit } = useGame();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [words, setWords] = useState<number[]>([]);
  const [matched, setMatched] = useState(false);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    visit(exercise.id);
  }, [exercise.id]);
  const chapter = chapters[exercise.chapter];
  const prompt = exercise.prompts[index];
  const type = prompt?.type || exercise.type;
  const exIndex = exercises.findIndex((e) => e.id === exercise.id);
  const next = exercises[exIndex + 1];
  const score = answers.filter((a) => a.correct).length;
  const chapterComplete = exIndex % 5 === 4;
  const gameComplete = summary(progress).completed === 15;
  function check() {
    if (
      !prompt ||
      checked ||
      !selected ||
      (type === "sentence" && words.length !== prompt.options.length)
    )
      return;
    setChecked(true);
    setAnswers([...answers, { submitted: selected, correct: evaluate(selected, prompt.answer) }]);
  }
  function advance() {
    if (!checked) return;
    if (index === 2) {
      finish(exercise.id, answers);
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setSelected("");
    setWords([]);
    setMatched(false);
    setChecked(false);
  }
  return (
    <SiteLayout>
      <main className="exercise-main">
        <div className="exercise-top">
          <Link to="/play" className="back-link">
            <ArrowLeft />
            Kthehu te rruga e udhëtimit
          </Link>
          <span className="exercise-step">
            {done ? "Sfida e plotësuar" : `Pyetja ${index + 1} nga 3`}
          </span>
        </div>
        <ProgressBar value={done ? 3 : index} max={3} label="Përparimi i sfidës" />
        {done ? (
          <div className="complete-view">
            <div className="achievement">{chapterComplete ? <Flag /> : <Trophy />}</div>
            <div className="eyebrow justify-center">{chapter?.title}</div>
            <h1>
              {gameComplete
                ? "Aventura jote është e plotësuar!"
                : chapterComplete
                  ? "Kapitulli u plotësua!"
                  : "Sfida u plotësua!"}
            </h1>
            <div className="complete-score">
              {score} / 3 <span className="text-lg text-muted-foreground">të sakta</span>
            </div>
            <p className="page-subtitle">
              {score === 3
                ? "Punë e shkëlqyer — i ke gjithë të saktët."
                : score === 2
                  ? "Shumë mirë! Çdo sfidë është një hap përpara."
                  : "Vazhdo — praktika e bën këto fjalë të njohura."}
            </p>
            {chapterComplete && (
              <p className="page-subtitle mt-3">
                {next
                  ? `${chapter?.title} është plotësuar. Hapi tjetër: ${chapters[next.chapter]?.title}`
                  : "Të tre kapitujt janë plotësuar. Rezultati yt përfundimtar është gati."}
              </p>
            )}
            <div className="complete-actions">
              {gameComplete ? (
                <Button asChild variant="cta" size="quest">
                  <Link to="/results">
                    Shiko rezultatin <ArrowRight />
                  </Link>
                </Button>
              ) : next ? (
                <Button asChild variant="cta" size="quest">
                  <Link to="/play/$exerciseId" params={{ exerciseId: next.id }}>
                    Sfida tjetër <ArrowRight />
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="quest" className="quest-button">
                <Link to="/play">Vazhdo te rruga e udhëtimit</Link>
              </Button>
            </div>
          </div>
        ) : (
          prompt && (
            <>
              <div className="exercise-heading">
                <div className="eyebrow">
                  Kapitulli {exercise.chapter + 1} · {chapter?.title}
                </div>
                <h1>{exercise.title}</h1>
                <p>{exercise.instructions}</p>
              </div>
              <section className="exercise-tool" aria-label="Pyetja aktive">
                <div className="question-label">
                  {type === "match"
                    ? "Përputh kuptimin"
                    : type === "picture"
                      ? "Gjej foton"
                      : type === "sentence"
                        ? "Ndërto fjalinë"
                        : type === "dialogue"
                          ? "Radha jote për të përgjigjur"
                          : "Zgjidh përgjigjen tuaj"}
                </div>
                {type !== "match" && <p className="prompt">{prompt.question}</p>}
                <ExerciseInteraction
                  prompt={prompt}
                  type={type}
                  selected={selected}
                  setSelected={setSelected}
                  words={words}
                  setWords={setWords}
                  matched={matched}
                  setMatched={setMatched}
                  checked={checked}
                />
                {checked && (
                  <div
                    className={`feedback ${answers[index]?.correct ? "" : "wrong"}`}
                    aria-live="polite"
                    role="status"
                  >
                    {answers[index]?.correct ? <CheckCircle2 /> : <CircleHelp />}
                    <div>
                      <strong>
                        {answers[index]?.correct
                          ? "Saktë — punë e shkëlqyer!"
                          : "Jo plotësisht — ja përgjigja."}
                      </strong>
                      {!answers[index]?.correct && (
                        <p className="correction">Përgjigja e saktë: {prompt.answer}</p>
                      )}
                      <p>{prompt.explanation}</p>
                    </div>
                  </div>
                )}
                <div className="exercise-actions">
                  <span className="hint">
                    <Lightbulb />
                    {type === "sentence"
                      ? "Mbaj foljen në vendin e duhur."
                      : type === "match"
                        ? "Zgjidh frazën gjermane dhe pastaj kuptimin e saj."
                        : type === "blank"
                          ? "Shiko të gjithë frazën."
                          : "Merr kohë. Ti e ke këtë."}
                  </span>
                  {checked ? (
                    <Button variant="cta" size="quest" onClick={advance}>
                      {index === 2 ? "Përfundo sfidën" : "Vazhdo"}
                      <ArrowRight />
                    </Button>
                  ) : (
                    <Button
                      variant="quest"
                      size="quest"
                      disabled={
                        !selected ||
                        (type === "sentence" && words.length !== prompt.options.length) ||
                        (type === "match" && !matched)
                      }
                      onClick={check}
                    >
                      Kontrollo përgjigjen <CheckCircle2 />
                    </Button>
                  )}
                </div>
              </section>
            </>
          )
        )}
      </main>
    </SiteLayout>
  );
}
