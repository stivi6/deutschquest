import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Star, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, ProgressBar } from "@/components/layout/SiteLayout";
import { ResetDialog } from "@/components/layout/ResetDialog";
import { useGame } from "@/game/progress";
import { summary, category } from "@/game/logic";
import { chapters } from "@/data/exercises";
import { pageHead } from "@/game/meta";
export const Route = createFileRoute("/results")({
  head: () =>
    pageHead(
      "Aventura jote gjuhësore është e plotësuar",
      "Pikët e lojës DeutschQuest, përbërja e kapitujve dhe arritjet e të mësuarit.",
    ),
  component: Results,
});
function Results() {
  const { progress, ready } = useGame();
  const result = summary(progress);
  const band = category(result.percentage);
  if (ready && result.completed !== 15) return <Navigate to="/play" />;
  return (
    <SiteLayout>
      {!ready ? (
        <main className="loading-state">Po ngarkohet rezultati yt…</main>
      ) : (
        <main className="results-main">
          <div className="achievement">
            <Trophy />
          </div>
          <div className="eyebrow justify-center">15 sfida. Një udhëtim i shkëlqyer.</div>
          <h1>Aventura jote gjuhësore është e plotësuar!</h1>
          <p className="result-category">{band.title}</p>
          <div className="result-percent">{result.percentage}%</div>
          <p className="result-comment">
            {result.total === 45 ? "Pikë perfekte! U përgjigje çdo sfide me saktësi." : band.comment}
          </p>
          <div className="result-stats">
            <div className="stat">
              <Star />
              <strong>{result.total} / 45 të sakta</strong>
              <span>Përgjigjet më të mira</span>
            </div>
            <div className="stat">
              <CheckCircle2 />
              <strong>15 / 15</strong>
              <span>Sfida të plotësuara</span>
            </div>
            <div className="stat">
              <BookOpen />
              <strong>{chapters[result.strongest]?.title}</strong>
              <span>Kapitulli më i fortë</span>
            </div>
          </div>
          <section className="chapter-results">
            <h2>Përbërja e kapitujve</h2>
            {chapters.map((chapter, c) => (
              <div className="chapter-result" key={chapter.title}>
                <span>{chapter.title}</span>
                <ProgressBar
                  value={result.chapterScores[c] || 0}
                  max={15}
                  label={`${chapter.title} rezultat`}
                />
                <strong>{result.chapterScores[c]} / 15</strong>
              </div>
            ))}
          </section>
          <div className="complete-actions">
            <Button asChild variant="quest" size="quest">
              <Link to="/review">
                Rishiko gabimet <ArrowRight />
              </Link>
            </Button>
            <ResetDialog again />
          </div>
          <div className="mt-6">
            <Link to="/play" className="back-link">
              <ArrowLeft />
              Kthehu te rruga e udhëtimit
            </Link>
          </div>
          <p className="disclaimer">
            Ky është rezultati i lojës, jo një certifikatë zyrtare gjuhësore.
          </p>
        </main>
      )}
    </SiteLayout>
  );
}
