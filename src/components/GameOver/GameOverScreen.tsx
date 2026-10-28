import React, { useState, useEffect } from 'react';
import { sfx } from '../../utils/sfx';

interface GameOverScreenProps {
  score: number;
  onContinue: () => void;
  onViewLeaderboard: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onContinue,
  onViewLeaderboard
}) => {
  const [countdown, setCountdown] = useState<number>(9);
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    sfx.playGameOver();
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        sfx.playBeep();
        return prev - 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleInsertCoin = () => {
    sfx.playCoin();
    onContinue();
  };

  return (
    <section className="game-over-screen" id="game-over">
      <div className="go-vignette" />

      <div className="go-container">
        <div className="go-glitch-wrapper">
          <h1 className="go-main-title">GAME OVER</h1>
          <p className="go-sub-title">MEMORY EXHAUSTED // SYSTEM HALTED</p>
        </div>

        {/* Arcade Countdown */}
        <div className="go-countdown-box">
          <span className="go-continue-prompt">CONTINUE ?</span>
          <div className={`go-countdown-number ${expired ? 'is-zero' : ''}`}>
            {countdown}
          </div>
          <span className="go-coin-hint">
            {expired ? 'TIME EXPIRED — INSERT 1 COIN TO RESURRECT' : 'INSERT COIN BEFORE TIMER REACHES 0'}
          </span>
        </div>

        {/* Mission Stats */}
        <div className="go-stats-panel">
          <div className="go-stat-item">
            <span className="go-stat-label">FINAL SCORE</span>
            <span className="go-stat-value text-gold">
              {(score || 999990).toLocaleString()}
            </span>
          </div>
          <div className="go-stat-item">
            <span className="go-stat-label">CLEAR RATE</span>
            <span className="go-stat-value text-cyan">100% SOLVED</span>
          </div>
          <div className="go-stat-item">
            <span className="go-stat-label">PILOT RANK</span>
            <span className="go-stat-value text-purple">S+ GRANDMASTER</span>
          </div>
        </div>

        {/* Controls */}
        <div className="go-actions">
          <button
            type="button"
            className="retro-btn btn-primary btn-large go-insert-coin-btn"
            onClick={handleInsertCoin}
          >
            <span className="coin-icon">🪙</span>
            <span>INSERT COIN (START)</span>
          </button>

          <button
            type="button"
            className="retro-btn btn-secondary"
            onClick={() => {
              sfx.playRotate();
              onViewLeaderboard();
            }}
          >
            <span>REGISTER IN HALL OF FAME 🏆</span>
          </button>
        </div>

        <div className="go-arcade-bezel">
          <span>CREDITS: 04 // COPYRIGHT (C) 2026 CLANCY DESILVA ARCADE</span>
        </div>
      </div>
    </section>
  );
};
