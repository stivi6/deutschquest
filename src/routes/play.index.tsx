import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, LockKeyhole, Check, Flag } from "lucide-react";
import { SiteLayout, ProgressBar } from "@/components/layout/SiteLayout";
import { ResetDialog } from "@/components/layout/ResetDialog";
import { Button } from "@/components/ui/button";
import { chapters, exercises } from "@/data/exercises";
import { useGame } from "@/game/progress";
import { summary, status } from "@/game/logic";
import { pageHead } from "@/game/meta";
export const Route = createFileRoute("/play/")({
  head: () =>
    pageHead(
      "Udhëtimi yt i të mësuarit",
      "Ndiq tre kapituj dhe plotëso 15 sfida gjermane për të çliruar rezultatin përfundimtar.",
    ),
  component: Roadmap,
});
function Roadmap() {
  const { progress, ready } = useGame();
  const result = summary(progress);
  return (
    <SiteLayout>
      <main className="container page-main">
        <Link to="/" className="back-link">
          <ArrowLeft />
          Kthehu te Kreu
        </Link>
        <div className="journey-heading">
          <div>
            <div className="eyebrow">
              <Flag /> Aventura juaj tjetër
            </div>
            <h1 className="page-title">Udhëtimi yt i të mësuarit</h1>
            <p className="page-subtitle">Plotëso të gjitha 15 sfidat për të hapur rezultatin përfundimtar.</p>
          </div>
          <div className="overall-progress">
            <div className="progress-label">
              <strong>{result.completed} / 15 të plotësuara</strong>
              <span>{Math.round((result.completed / 15) * 100)}%</span>
            </div>
            <ProgressBar value={result.completed} max={15} label="Përparimi i udhëtimit" />
          </div>
        </div>
        {!ready ? (
          <div className="loading-state">Po ngarkohet udhëtimi yt…</div>
        ) : (
          <>
            <div className="roadmap">
              {chapters.map((chapter, c) => {
                const list = exercises.filter((e) => e.chapter === c);
                const done = list.every((e) => progress.exercises[e.id]?.completed);
                return (
                  <section className={`chapter-row ${chapter.theme}`} key={chapter.title}>
                    <div className="row-intro">
                      <div className="row-illustration">
                        <img
                          src={`/assets/illustrations/${chapter.image}.svg`}
                          alt=""
                          width="98"
                          height="82"
                        />
                      </div>
                      <div>
                        <span className="chapter-tag">
                          Kapitulli 0{c + 1} {done ? "· Plotësuar" : ""}
                        </span>
                        <h2>{chapter.title}</h2>
                        <span className="level">{chapter.level}</span>
                      </div>
                    </div>
                    <div className="road-nodes">
                      {list.map((exercise, i) => {
                        const state = status(progress, exercise.id);
                        const nodeContent =
                          state === "completed" ? (
                            <Check />
                          ) : state === "locked" ? (
                            <LockKeyhole />
                          ) : (
                            i + 1
                          );
                        return (
                          <div className="node-wrap" key={exercise.id}>
                            {state === "locked" ? (
                              <Button
                                variant="ghost"
                                className="node locked"
                                disabled
                                aria-label={`${exercise.title} — i mbyllur`}
                                data-testid={`roadmap-node-${exercise.id}`}
                              >
                                {nodeContent}
                              </Button>
                            ) : (
                              <Button asChild variant="ghost" className={`node ${state}`}>
                                <Link
                                  to="/play/$exerciseId"
                                  params={{ exerciseId: exercise.id }}
                                  aria-label={`${exercise.title}${state === "completed" ? " — rifillo" : ""}`}
                                  data-testid={`roadmap-node-${exercise.id}`}
                                >
                                  {nodeContent}
                                </Link>
                              </Button>
                            )}
                            <span className="node-label">{exercise.title}</span>
                            {state === "completed" && (
                              <span className="node-score">
                                {progress.exercises[exercise.id]?.bestCorrect} / 3 të sakta
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
            <div className="journey-bottom">
              <div className="legend">
                <span>
                  <i className="legend-dot complete" />
                  Plotësuar
                </span>
                <span>
                  <i className="legend-dot current" />
                  Tjetra
                </span>
                <span>
                  <i className="legend-dot" />
                  I bllokuar
                </span>
              </div>
              <ResetDialog />
            </div>
            {result.completed === 15 && (
              <div className="complete-actions">
                <Button asChild variant="cta" size="quest">
                  <Link to="/results">
                    Shiko rezultatin e fundit <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </SiteLayout>
  );
}
