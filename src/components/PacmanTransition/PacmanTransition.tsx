import React, { useEffect, useState, useRef } from 'react';
import { sfx } from '../../utils/sfx';

interface PacmanTransitionProps {
  isActive: boolean;
  onTransitionComplete: () => void;
}

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

  // Pellets calculation: 16 pellets across screen
  const pelletCount = 18;
  const pacmanPercent = progress * 115; // from 0% to 115%

  return (
    <div className="pacman-transition-overlay" aria-hidden="true">
      {/* Black wipe eating the screen behind Pac-Man */}
      <div
        className="pacman-screen-eater"
        style={{ width: `${Math.min(100, pacmanPercent)}%` }}
      />

      {/* Row of Pellets ahead of Pac-Man */}
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

      {/* Sweeping Pac-Man sprite */}
      <div
        className="pacman-character"
        style={{
          left: `calc(${progress * 110}% - 60px)`
        }}
      >
        <div className="pacman-mouth-top" />
        <div className="pacman-mouth-bottom" />
        <div className="pacman-eye" />
      </div>

      <div className="pacman-loading-text">
        <span>WAKKA WAKKA WAKKA...</span>
      </div>
    </div>
  );
};
