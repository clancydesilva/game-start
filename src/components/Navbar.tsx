import React from 'react';
import type { PageView } from '../types';
import { sfx } from '../utils/sfx';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  score: number;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  score,
  sfxEnabled,
  onToggleSfx,
  crtEnabled,
  onToggleCrt
}) => {
  const navItems: { id: PageView; label: string; icon: string }[] = [
    { id: 'projects', label: 'TETRIS PROJECTS', icon: '▦' },
    { id: 'idealab', label: 'IDEA LAB', icon: '⚗' },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: '🏆' },
    { id: 'docs', label: 'NPM & DOCS', icon: '📦' },
    { id: 'gameover', label: 'GAME OVER', icon: '💀' }
  ];

  return (
    <header className="arcade-navbar" role="banner">
      <div className="navbar-top-bezel">
        <div className="player-badge">
          <span className="blink-beacon">●</span>
          <span className="player-title">1UP CLANCY DESILVA</span>
          <span className="player-coins">CREDIT 02</span>
        </div>

        <div className="navbar-score-box">
          <span className="hud-title">HIGH SCORE</span>
          <span className="hud-number">{score.toString().padStart(6, '0')}</span>
        </div>

        <div className="navbar-toggles">
          <button
            type="button"
            className={`retro-toggle-btn ${sfxEnabled ? 'active' : ''}`}
            onClick={onToggleSfx}
            title="Toggle Arcade Sound Effects"
          >
            SFX: {sfxEnabled ? 'ON' : 'MUTE'}
          </button>
          <button
            type="button"
            className={`retro-toggle-btn ${crtEnabled ? 'active' : ''}`}
            onClick={onToggleCrt}
            title="Toggle Retro CRT Scanlines"
          >
            CRT: {crtEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <nav className="navbar-nav-tabs" aria-label="Arcade Navigation">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                if (!isActive) {
                  sfx.playRotate();
                  onNavigate(item.id);
                }
              }}
            >
              <span className="nav-tab-icon">{item.icon}</span>
              <span className="nav-tab-label">{item.label}</span>
              {isActive && <span className="nav-active-pip">▲</span>}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
