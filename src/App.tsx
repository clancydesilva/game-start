import { useState } from 'react';
import type { PageView } from './types';
import { sfx } from './utils/sfx';
import { ScanlineOverlay } from './components/ScanlineOverlay';
import { Navbar } from './components/Navbar';
import { TetrisSection } from './components/TetrisBoard/TetrisSection';
import { IdeaLabSection } from './components/IdeaLab/IdeaLabSection';
import { DocsLaunchSection } from './components/DocsLaunch/DocsLaunchSection';
import { GameOverScreen } from './components/GameOver/GameOverScreen';
import { PacmanTransition } from './components/PacmanTransition/PacmanTransition';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('projects');
  const [pendingPage, setPendingPage] = useState<PageView | null>(null);
  const [isPacmanActive, setIsPacmanActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(12800);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);

  // Trigger Pac-Man transition between pages
  const handleNavigate = (targetPage: PageView) => {
    if (targetPage === currentPage || isPacmanActive) return;
    setPendingPage(targetPage);
    setIsPacmanActive(true);
  };

  const handlePacmanComplete = () => {
    if (pendingPage) {
      setCurrentPage(pendingPage);
      setPendingPage(null);
    }
    setIsPacmanActive(false);
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    sfx.enabled = next;
    if (next) sfx.playCoin();
  };

  const handleToggleCrt = () => {
    sfx.playBeep();
    setCrtEnabled((prev) => !prev);
  };

  return (
    <div className="arcade-app-root">
      {/* CRT Scanline & Phosphor Overlay */}
      <ScanlineOverlay enabled={crtEnabled} />

      {/* Arcade Header HUD with Large Centered Name */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        score={score}
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
        crtEnabled={crtEnabled}
        onToggleCrt={handleToggleCrt}
      />

      {/* Main Arcade Cabinet Screen */}
      <main className="arcade-cabinet-viewport">
        {currentPage === 'projects' && (
          <TetrisSection onScoreChange={(newScore) => setScore((prev) => Math.max(prev, newScore))} />
        )}

        {currentPage === 'idealab' && (
          <IdeaLabSection onOpenDocs={() => handleNavigate('docs')} />
        )}

        {currentPage === 'docs' && (
          <DocsLaunchSection />
        )}

        {currentPage === 'gameover' && (
          <GameOverScreen
            score={score}
            onContinue={() => handleNavigate('projects')}
            onViewLeaderboard={() => handleNavigate('projects')}
          />
        )}
      </main>

      {/* Retro Arcade Footer */}
      <footer className="arcade-cabinet-footer">
        <div className="footer-coin-slot">
          <span className="coin-slot-graphic">[ INSERT COIN ]</span>
          <span className="coin-slot-label">25¢ TO PLAY</span>
        </div>
        <div className="footer-credits">
          <span>PORTFOLIO ARCADE SYSTEM 2026 // CLANCY DESILVA</span>
          <span>BUILT WITH REACT 19 + TYPESCRIPT + VITE</span>
        </div>
        <div className="footer-social-links">
          <a
            href="https://github.com/clancydesilva"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sfx.playCoin()}
          >
            GITHUB ↗
          </a>
          <a
            href="mailto:clancydesilva@example.com"
            onClick={() => sfx.playCoin()}
          >
            CONTACT ↗
          </a>
        </div>
      </footer>

      {/* Fullscreen Chomping Pac-Man Page Transition */}
      <PacmanTransition
        isActive={isPacmanActive}
        onTransitionComplete={handlePacmanComplete}
      />
    </div>
  );
}
