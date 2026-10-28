import React, { useState, useEffect, useRef } from 'react';
import type { ProjectItem } from '../../types';
import { PROJECTS, TETRIS_COLS, TETRIS_ROWS } from '../../utils/constants';
import { TetrisBlock } from './TetrisBlock';
import { ProjectModal } from './ProjectModal';
import { sfx } from '../../utils/sfx';

interface TetrisSectionProps {
  onScoreChange?: (score: number) => void;
}

export const TetrisSection: React.FC<TetrisSectionProps> = ({ onScoreChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [landedCount, setLandedCount] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Sound ref to prevent spamming audio
  const prevLandedRef = useRef<number>(0);

  // Total projects = 12
  const totalProjects = PROJECTS.length;

  // Scroll detection to trigger falling pieces
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start dropping when section enters view
      const topOffset = rect.top;
      const totalScrollable = rect.height - windowHeight * 0.4;
      
      // Calculate progress from 0 to 1
      const progress = Math.min(
        1,
        Math.max(0, (windowHeight * 0.7 - topOffset) / (totalScrollable > 0 ? totalScrollable : 1))
      );

      const targetCount = Math.min(totalProjects, Math.floor(progress * (totalProjects + 1)));

      if (targetCount !== landedCount) {
        setLandedCount(targetCount);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalProjects, landedCount]);

  // Handle score, lines, and audio effects on pieces landing
  useEffect(() => {
    if (landedCount > prevLandedRef.current) {
      // Piece landed!
      sfx.playDrop();

      let addedScore = 0;
      for (let i = prevLandedRef.current; i < landedCount; i++) {
        addedScore += PROJECTS[i]?.points || 500;
      }

      setScore((prev) => {
        const nextScore = prev + addedScore;
        onScoreChange?.(nextScore);
        return nextScore;
      });

      // Rows cleared approximation
      setLines(Math.floor((landedCount / totalProjects) * TETRIS_ROWS));

      if (landedCount === totalProjects && !isSolved) {
        setIsSolved(true);
        sfx.playLineClear();
        setScore((prev) => {
          const finalBonus = prev + 10000;
          onScoreChange?.(finalBonus);
          return finalBonus;
        });
      }
    } else if (landedCount < prevLandedRef.current) {
      // Reset occurred
      setIsSolved(false);
    }
    prevLandedRef.current = landedCount;
  }, [landedCount, totalProjects, isSolved, onScoreChange]);

  const handleManualDropAll = () => {
    sfx.playCoin();
    setLandedCount(totalProjects);
  };

  const handleManualStepDrop = () => {
    if (landedCount < totalProjects) {
      sfx.playRotate();
      setLandedCount((prev) => Math.min(totalProjects, prev + 1));
    }
  };

  const handleResetBoard = () => {
    sfx.playBeep();
    setLandedCount(0);
    setScore(0);
    setLines(0);
    setIsSolved(false);
    prevLandedRef.current = 0;
    onScoreChange?.(0);
  };

  // Build grid map for the 6x8 board
  // grid[y][x] = { project, isLanded }
  const gridState: { project: ProjectItem | null; isLanded: boolean }[][] = Array.from(
    { length: TETRIS_ROWS },
    () => Array.from({ length: TETRIS_COLS }, () => ({ project: null, isLanded: false }))
  );

  PROJECTS.forEach((project, index) => {
    const isLanded = index < landedCount;
    project.solvedCells.forEach((cell) => {
      if (cell.y >= 0 && cell.y < TETRIS_ROWS && cell.x >= 0 && cell.x < TETRIS_COLS) {
        gridState[cell.y][cell.x] = { project, isLanded };
      }
    });
  });

  return (
    <section ref={containerRef} className="tetris-section-wrapper" id="projects-arcade">
      <div className="arcade-cabinet-header">
        <div className="arcade-title-box">
          <span className="arcade-sub">STAGE 01 // PORTFOLIO MATRIX</span>
          <h2 className="arcade-main-title">
            <span className="title-tetris">TETRIS</span> PROJECTS
          </h2>
          <p className="arcade-instruction">
            SCROLL DOWN TO DROP BLOCKS • CLICK ANY PIECE FOR DETAILS
          </p>
        </div>

        {/* Live HUD Scoreboard */}
        <div className="arcade-hud-panel">
          <div className="hud-metric">
            <span className="hud-label">SCORE</span>
            <span className="hud-value hud-score">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">BLOCKS</span>
            <span className="hud-value">
              {landedCount} / {totalProjects}
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">LINES</span>
            <span className="hud-value hud-lines">{lines} / {TETRIS_ROWS}</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">STATUS</span>
            <span className={`hud-value ${isSolved ? 'hud-solved' : 'hud-active'}`}>
              {isSolved ? '★ SOLVED ★' : 'FALLING...'}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Control Buttons */}
      <div className="arcade-controls-bar">
        <button className="retro-btn btn-sm" onClick={handleManualStepDrop} disabled={landedCount >= totalProjects}>
          <span>▼ STEP DROP</span>
        </button>
        <button className="retro-btn btn-sm btn-primary" onClick={handleManualDropAll} disabled={landedCount >= totalProjects}>
          <span>⚡ DROP ALL</span>
        </button>
        <button className="retro-btn btn-sm btn-outline" onClick={handleResetBoard}>
          <span>↺ RESET</span>
        </button>
      </div>

      {/* Main Board Layout */}
      <div className="arcade-arena-grid">
        {/* The 6-Column Solved Board */}
        <div className="tetris-board-frame">
          <div className="board-top-marquee">
            <span className="marquee-beacon">● 6-COL MATRIX ACTIVE ●</span>
          </div>

          <div className="tetris-grid-container">
            {/* Grid Column Labels */}
            <div className="grid-col-headers">
              {Array.from({ length: TETRIS_COLS }).map((_, c) => (
                <div key={c} className="col-header-cell">
                  0{c + 1}
                </div>
              ))}
            </div>

            {/* Matrix Cells */}
            <div className="grid-matrix-body">
              {gridState.map((row, y) => (
                <div key={y} className="grid-matrix-row">
                  {row.map((cell, x) => {
                    const isHovered =
                      cell.project && cell.project.id === hoveredProjectId;

                    return (
                      <div
                        key={x}
                        className={`grid-cell-slot ${cell.project ? 'has-piece' : ''} ${
                          cell.isLanded ? 'cell-landed' : 'cell-empty'
                        } ${isHovered ? 'cell-highlighted' : ''}`}
                        onClick={() => {
                          if (cell.project) {
                            setSelectedProject(cell.project);
                          }
                        }}
                        onMouseEnter={() => {
                          if (cell.project) setHoveredProjectId(cell.project.id);
                        }}
                        onMouseLeave={() => setHoveredProjectId(null)}
                      >
                        {cell.project ? (
                          <div
                            className={`falling-cell-anim ${
                              cell.isLanded ? 'is-landed' : 'is-falling'
                            }`}
                          >
                            <TetrisBlock
                              color={cell.project.color}
                              size="100%"
                              isGhost={!cell.isLanded}
                              isSolved={isSolved}
                              label={cell.isLanded ? cell.project.type : ''}
                            />
                          </div>
                        ) : (
                          <div className="empty-cell-dot" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {isSolved && (
            <div className="board-solved-banner">
              <span className="solved-flash">★ TETRIS 100% SOLVED! ★</span>
              <span className="solved-bonus">+10,000 PTS BONUS AWARDED</span>
            </div>
          )}
        </div>

        {/* Project Roster & Next Queue */}
        <div className="arcade-queue-sidebar">
          <div className="queue-header">
            <span className="queue-title">PROJECT DISK DIRECTORY</span>
            <span className="queue-sub">CLICK TO BOOT EXECUTABLE</span>
          </div>

          <div className="project-queue-list">
            {PROJECTS.map((project, idx) => {
              const isLanded = idx < landedCount;
              const isHovered = hoveredProjectId === project.id;

              return (
                <div
                  key={project.id}
                  className={`project-queue-card ${isLanded ? 'card-landed' : 'card-pending'} ${
                    isHovered ? 'card-hovered' : ''
                  }`}
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                >
                  <div className="card-left-badge" style={{ backgroundColor: project.color }}>
                    <span className="card-tetromino-type">{project.type}</span>
                  </div>

                  <div className="card-main-info">
                    <div className="card-title-row">
                      <span className="card-title" style={{ color: project.color }}>
                        {project.title}
                      </span>
                      <span className="card-points">+{project.points}</span>
                    </div>
                    <p className="card-tagline">{project.tagline}</p>
                    <div className="card-tags-mini">
                      {project.tags.slice(0, 2).map((t, ti) => (
                        <span key={ti} className="mini-tag">
                          {t}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="mini-tag">+{project.tags.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <div className="card-status-pill">
                    {isLanded ? (
                      <span className="pill-locked">LOCKED IN</span>
                    ) : (
                      <span className="pill-queue">IN QUEUE</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
