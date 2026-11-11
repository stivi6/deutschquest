import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { chapters, exercises } from "@/data/exercises";
import { useGame } from "@/game/progress";
import { summary } from "@/game/logic";
import { pageHead } from "@/game/meta";
export const Route = createFileRoute("/review")({
  head: () =>
    pageHead(
      "Rishiko gabimet",
      "Rishiko përgjigjet e tua, mëso nga korrigjimet dhe përmirëso rezultatin më të mirë.",
    ),
  component: Review,
});
function Review() {
  const { progress, ready } = useGame();
  if (ready && summary(progress).completed !== 15) return <Navigate to="/play" />;
  const mistakes = exercises.flatMap((ex) =>
    ex.prompts.flatMap((prompt, i) => {
      const answer = progress.exercises[ex.id]?.answers[i];
      return answer && !answer.correct ? [{ ex, prompt, answer }] : [];
    }),
  );
  return (
    <SiteLayout>
      <main className="container page-main review-main">
        <Link to="/results" className="back-link">
          <ArrowLeft />
          Kthehu te rezultatet
        </Link>
        <h1 className="page-title">Paqëndrim i vogël. Fillim i ri.</h1>
        <p className="page-subtitle">Pyetjet e tua të vështira, me përgjigjet që vlen të mbahen mend.</p>
        {!ready ? (
          <div className="loading-state">Po ngarkohen përgjigjet tuaja…</div>
        ) : mistakes.length === 0 ? (
          <div className="complete-view">
            <div className="achievement">
              <CheckCircle2 />
            </div>
            <h2>Pikë e shkëlqyer — iu përgjigje çdo sfide me saktësi.</h2>
          </div>
        ) : (
          chapters.map((chapter, c) => {
            const list = mistakes.filter((m) => m.ex.chapter === c);
            return (
              list.length > 0 && (
                <section key={chapter.title} className="review-chapter">
                  <h2>{chapter.title}</h2>
                  {list.map(({ ex, prompt, answer }) => (
                    <article className="mistake" key={`${ex.id}-${prompt.question}`}>
                      <h3>{ex.title}</h3>
                      <div className="review-question">{prompt.question}</div>
                      <p className="wrong-answer">Përgjigja jote: {answer.submitted}</p>
                      <p className="right-answer">Përgjigja e saktë: {prompt.answer}</p>
                      <p className="text-muted-foreground">{prompt.explanation}</p>
                      <Link
                        to="/play/$exerciseId"
                        params={{ exerciseId: ex.id }}
                        className="text-sm text-primary underline"
                      >
                        Provo sërish këtë sfidë
                      </Link>
                    </article>
                  ))}
                </section>
              )
            );
          })
        )}
      </main>
    </SiteLayout>
  );
}
