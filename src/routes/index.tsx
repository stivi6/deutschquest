import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, BookOpen, Trophy, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { chapters } from "@/data/exercises";
import { pageHead } from "@/game/meta";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Mëso gjermanisht. Luaj sipas mënyrës tënde.",
      "Një aventurë e shkurtër e mësimit të gjermanishtes me 3 kapituj, 15 mini-loja dhe një rezultat në fund.",
    ),
  component: Home,
});
function Home() {
  return (
    <SiteLayout home>
      <main>
        <section className="hero container">
          <div>
            <div className="eyebrow">
              <span className="flag" /> Pak gjermanisht. Një aventurë e madhe.
            </div>
            <h1>
              Mëso gjermanisht.
              <br />
              <span>Luaj sipas mënyrës tënde.</span>
            </h1>
            <p className="hero-copy">
              Një aventurë e shkurtër për të mësuar gjermanisht me 3 kapituj, 15 mini-loja dhe një
              rezultat në fund.
            </p>
            <Button asChild variant="cta" size="quest">
              <Link to="/play">
                Mëso duke luajtur <ArrowRight />
              </Link>
            </Button>
            <div className="hero-micro">
              <span>
                <CheckCircle2 />
                Sfida të shkurtra
              </span>
              <span>
                <BookOpen />
                Ndiq përparimin
              </span>
              <span>
                <Trophy />
                Shiko rezultatet
              </span>
            </div>
          </div>
          <div className="hero-art">
            <img
              src="/assets/illustrations/home-cat.svg"
              alt="Një mace që lexon një libër gjermanisht"
              width="540"
              height="350"
            />
            <div className="speech">Hallo!</div>
            <div className="speech small-speech">Guten Tag!</div>
          </div>
        </section>
        <section className="chapter-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <h2>Tre kapituj. Një aventurë.</h2>
                <p>Që nga “Hallo!” i parë deri te bisedat e përditshme.</p>
              </div>
              <span className="section-note">
                Një sfidë e re në çdo pikë kontrolli{" "}
                <Sparkles className="inline size-4 ml-1 text-primary" />
              </span>
            </div>
            <div className="chapter-grid">
              {chapters.map((chapter, i) => (
                <Link to="/play" className={`chapter-preview ${chapter.theme}`} key={chapter.title}>
                  <div className="chapter-art">
                    <span className="chapter-number">Kapitulli 0{i + 1}</span>
                    <img
                      src={`/assets/illustrations/${chapter.image}.svg`}
                      alt=""
                      width="240"
                      height="120"
                      loading="lazy"
                    />
                  </div>
                  <div className="chapter-body">
                    <h3>{chapter.title}</h3>
                    <span className="level">{chapter.level}</span>
                    <p>{chapter.description}</p>
                    <div className="chapter-meta">
                      <span>5 mini-loja · 15 pyetje</span>
                      <ChevronRight />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section id="how-it-works" className="info-section">
          <div className="container">
            <h2>Pak hapa të vegjël. Shumë gjermanisht.</h2>
            <div className="steps">
              <div>
                <span className="step-number">01</span>
                <h3>Zgjidh sfidën e parë</h3>
                <p>Fillo me përshëndetjet dhe ndiq rrugën tënde nëpër tre kapituj.</p>
              </div>
              <div>
                <span className="step-number">02</span>
                <h3>Mëso dhe Luaj</h3>
                <p>
                  Përputh fjalët, ndërto fjali dhe provo biseda të përditshme. Çdo përgjigje është
                  një mundësi për të mësuar.
                </p>
              </div>
              <div>
                <span className="step-number">03</span>
                <h3>Shiko rezultatet</h3>
                <p>Përfundo udhëtimin, shiko rezultatin e lojës dhe rishiko çdo pyetje të vështirë.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
