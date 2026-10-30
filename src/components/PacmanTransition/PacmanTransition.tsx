import React, { useEffect, useState, useRef } from 'react';
import { sfx } from '../../utils/sfx';

interface PacmanTransitionProps {
  isActive: boolean;
  onTransitionComplete: () => void;
}

// 13x13 8-bit jagged pixel matrices for Pac-Man (open & half-closed chomp frames)
const PACMAN_OPEN_GRID = [
  [0,0,0,0,1,1,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,0,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0],
  [1,1,1,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,1,1,1,1,1,0,0,0,0],
];

const PACMAN_CLOSED_GRID = [
  [0,0,0,0,1,1,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,0,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,1,1,1,1,1,0,0,0,0],
];

export const PacmanTransition: React.FC<PacmanTransitionProps> = ({
  isActive,
  onTransitionComplete
}) => {
  const [progress, setProgress] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const chompSoundTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const startTime = performance.now();
    const duration = 850; // ms for sweep

    // Play periodic wakka sound
    sfx.playPacman();
    chompSoundTimer.current = window.setInterval(() => {
      sfx.playPacman();
    }, 160);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const currentProgress = Math.min(1, elapsed / duration);
      setProgress(currentProgress);

      if (currentProgress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        if (chompSoundTimer.current) clearInterval(chompSoundTimer.current);
        onTransitionComplete();
      }
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (chompSoundTimer.current) clearInterval(chompSoundTimer.current);
    };
  }, [isActive, onTransitionComplete]);

  if (!isActive) return null;

  // Pellets calculation: 18 square pixel pellets across screen
  const pelletCount = 18;
  const pacmanPercent = progress * 115; // from 0% to 115%
  const isMouthOpen = Math.floor(progress * 14) % 2 === 0;
  const activeGrid = isMouthOpen ? PACMAN_OPEN_GRID : PACMAN_CLOSED_GRID;

  return (
    <div className="pacman-transition-overlay" aria-hidden="true">
      {/* Black wipe eating the screen behind Pac-Man */}
      <div
        className="pacman-screen-eater"
        style={{ width: `${Math.min(100, pacmanPercent)}%` }}
      />

      {/* Row of Square Pixel Pellets ahead of Pac-Man */}
      <div className="pacman-pellet-track">
        {Array.from({ length: pelletCount }).map((_, idx) => {
          const pelletPercent = (idx / (pelletCount - 1)) * 96 + 2;
          const isEaten = pacmanPercent >= pelletPercent;

          return (
            <div
              key={idx}
              className={`pacman-pellet ${idx % 5 === 0 ? 'power-pellet' : ''} ${
                isEaten ? 'eaten' : ''
              }`}
              style={{ left: `${pelletPercent}%` }}
            />
          );
        })}
      </div>

      {/* Sweeping Jagged 8-Bit Pixelated Pac-Man Sprite */}
      <div
        className="pacman-character pacman-pixel-grid"
        style={{
          left: `calc(${progress * 110}% - 52px)`
        }}
      >
        {activeGrid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`pacman-pixel-cell ${cell === 1 ? 'filled' : ''}`}
            />
          ))
        )}
      </div>

      <div className="pacman-loading-text">
        <span>WAKKA WAKKA WAKKA...</span>
      </div>
    </div>
  );
};
