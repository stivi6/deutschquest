import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowRight, Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/game/progress";
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Kreu i DeutschQuest">
      <img
        className="brand-mark"
        src="/assets/brand/deutschquest-mark.svg"
        alt=""
        width="35"
        height="35"
      />
      <span>
        Deutsch<span className="brand-accent">Quest</span>
      </span>
    </Link>
  );
}
export function SiteLayout({ children, home = false }: { children: ReactNode; home?: boolean }) {
  const [menu, setMenu] = useState(false);
  const { storageWarning } = useGame();
  return (
    <div className="site">
      <header className="site-header container">
        <Brand />
        {home ? (
          <>
            <nav className={`nav-links ${menu ? "open" : ""}`} aria-label="Navigimi kryesor">
              <Link to="/" className="nav-link active" onClick={() => setMenu(false)}>
                Kreu
              </Link>
              <Link to="/" hash="how-it-works" className="nav-link" onClick={() => setMenu(false)}>
                Si funksionon
              </Link>
              <Link to="/" hash="about" className="nav-link" onClick={() => setMenu(false)}>
                Rreth
              </Link>
              <Button asChild variant="quest" size="quest">
                <Link to="/play">
                  Fillo të mësohësh <ArrowRight />
                </Link>
              </Button>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label={menu ? "Mbyll menun" : "Hap menun"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
          </>
        ) : (
          <Button asChild variant="ghost" className="quest-button">
            <Link to="/play">
              <BookOpen />
              Udhëtimi yt
            </Link>
          </Button>
        )}
      </header>
      {storageWarning && (
        <div className="container notice" role="status">
          Përparimi është i disponueshëm për këtë sesion, por ky browser nuk mund ta ruante.
        </div>
      )}
      {children}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <span className="footer-name">
              DeutschQuest <span className="brand-accent">·</span> Mëso gjermanisht. Luaj sipas mënyrës tënde.
            </span>
            <span>Përparimi ruhet lokalisht në këtë browser.</span>
          </div>
          <p className="credits">
            Të gjithë emoji-t janë dizenjuar nga{" "}
            <a href="https://openmoji.org/" target="_blank" rel="noreferrer">
              OpenMoji
            </a>{" "}
            – projekti i hapur i emoji-ve dhe ikonave. Licensa:{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              CC BY-SA 4.0.
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="progress-fill" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  );
}
