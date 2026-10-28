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
  const trackRef = useRef<HTMLDivElement>(null);
  const [landedCount, setLandedCount] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.08);
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  const prevLandedRef = useRef<number>(0);
  const totalProjects = PROJECTS.length; // 8 real projects

  // Scroll detection within the sticky track
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Track height minus sticky viewport height
      const scrollableDistance = rect.height - windowHeight;
      if (scrollableDistance <= 0) return;

      // Current scrolled distance through this track
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / scrollableDistance));
      setScrollPercent(Math.round(progress * 100));

      // Calculate how many pieces should be landed
      const targetCount = Math.min(totalProjects, Math.floor(progress * (totalProjects + 0.99)));
      if (targetCount !== landedCount) {
        setLandedCount(targetCount);
      }

      // Dynamic zoom-out calculation:
      // Starts slightly zoomed in (1.08x), smoothly pulls back to 0.96x as the matrix gets full
      const currentZoom = 1.08 - progress * 0.12;
      setZoomScale(currentZoom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalProjects, landedCount]);

  // Handle score, lines, and audio effects on pieces landing
  useEffect(() => {
    if (landedCount > prevLandedRef.current) {
      sfx.playDrop();

      let addedScore = 0;
      for (let i = prevLandedRef.current; i < landedCount; i++) {
        addedScore += PROJECTS[i]?.points || 1500;
      }

      setScore((prev) => {
        const nextScore = prev + addedScore;
        onScoreChange?.(nextScore);
        return nextScore;
      });

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
      setIsSolved(false);
    }
    prevLandedRef.current = landedCount;
  }, [landedCount, totalProjects, isSolved, onScoreChange]);

  const handleManualDropAll = () => {
    sfx.playCoin();
    setLandedCount(totalProjects);
    setZoomScale(0.96);
    setScrollPercent(100);
  };

  const handleManualStepDrop = () => {
    if (landedCount < totalProjects) {
      sfx.playRotate();
      setLandedCount((prev) => {
        const next = Math.min(totalProjects, prev + 1);
        setZoomScale(1.08 - (next / totalProjects) * 0.12);
        return next;
      });
    }
  };

  const handleResetBoard = () => {
    sfx.playBeep();
    setLandedCount(0);
    setScore(0);
    setLines(0);
    setIsSolved(false);
    setZoomScale(1.08);
    setScrollPercent(0);
    prevLandedRef.current = 0;
    onScoreChange?.(0);
  };

  // Build grid map for the 6x8 board
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

  const activeHoverProject = PROJECTS.find((p) => p.id === hoveredProjectId);

  return (
    <div ref={trackRef} className="tetris-sticky-track" id="projects-arcade">
      {/* Pinned Sticky Stage: Stays centered in viewport as you scroll */}
      <div className="tetris-sticky-stage">
        {/* HUD Info Header */}
        <div className="tetris-hud-bar">
          <div className="hud-metric">
            <span className="hud-label">SCORE</span>
            <span className="hud-value hud-score">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">PROJECTS LANDED</span>
            <span className="hud-value">{landedCount} / {totalProjects}</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">SOLVED ROWS</span>
            <span className="hud-value hud-lines">{lines} / {TETRIS_ROWS}</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">SCROLL PROGRESS</span>
            <span className="hud-value hud-progress">{scrollPercent}%</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">ZOOM CAM</span>
            <span className="hud-value hud-zoom">{Math.round(zoomScale * 100)}%</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">MATRIX STATUS</span>
            <span className={`hud-value ${isSolved ? 'hud-solved' : 'hud-active'}`}>
              {isSolved ? '★ 100% SOLVED ★' : 'FALLING...'}
            </span>
          </div>
        </div>

        {/* Control Buttons & Scroll Hint */}
        <div className="tetris-control-bar">
          <button
            className="retro-btn btn-sm"
            onClick={handleManualStepDrop}
            disabled={landedCount >= totalProjects}
          >
            <span>▼ STEP DROP</span>
          </button>
          <button
            className="retro-btn btn-sm btn-primary"
            onClick={handleManualDropAll}
            disabled={landedCount >= totalProjects}
          >
            <span>⚡ DROP ALL PIECES</span>
          </button>
          <button className="retro-btn btn-sm btn-outline" onClick={handleResetBoard}>
            <span>↺ RESET BOARD</span>
          </button>

          <div className="scroll-indicator-pill">
            <span className="scroll-pulse-icon">↕</span>
            <span className="scroll-text">
              {landedCount < totalProjects
                ? 'SCROLL DOWN TO DROP BLOCKS (STAGE STAYS PINNED)'
                : 'MATRIX COMPLETE! KEEP SCROLLING FOR LAB & TOOLS'}
            </span>
          </div>
        </div>

        {/* Project Hover Inspector Banner */}
        <div className="project-inspector-banner">
          {activeHoverProject ? (
            <div className="inspector-content" style={{ borderColor: activeHoverProject.color }}>
              <span className="inspector-dot" style={{ backgroundColor: activeHoverProject.color }} />
              <span className="inspector-title" style={{ color: activeHoverProject.color }}>
                {activeHoverProject.title}
              </span>
              <span className="inspector-divider">//</span>
              <span className="inspector-tagline">{activeHoverProject.tagline}</span>
              <span className="inspector-hint">▶ CLICK BLOCK TO OPEN DETAILS & REPO</span>
            </div>
          ) : (
            <div className="inspector-placeholder">
              <span>▼ HOVER & CLICK ANY TETRIS BLOCK TO INSPECT REPOSITORY DETAILS ▼</span>
            </div>
          )}
        </div>

        {/* Full-Width Screen-Dominant Tetris Board with Dynamic Zoom */}
        <div
          className="tetris-fullscreen-board-container"
          style={{
            transform: `scale(${zoomScale})`,
            transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          <div className="board-outer-bezel">
            <div className="board-top-marquee">
              <span>● 6-COLUMN FULLSCREEN MATRIX // CLANCY DESILVA REPOSITORIES ●</span>
            </div>

            <div className="tetris-matrix-wrap">
              {/* Column coordinate markers */}
              <div className="matrix-col-headers">
                {Array.from({ length: TETRIS_COLS }).map((_, c) => (
                  <div key={c} className="col-marker">
                    COL-0{c + 1}
                  </div>
                ))}
              </div>

              {/* Matrix rows and cells */}
              <div className="matrix-viewport">
                {gridState.map((row, y) => (
                  <div key={y} className="matrix-row">
                    {row.map((cell, x) => {
                      const isHovered =
                        cell.project && cell.project.id === hoveredProjectId;

                      return (
                        <div
                          key={x}
                          className={`matrix-cell ${cell.project ? 'has-piece' : ''} ${
                            cell.isLanded ? 'is-landed' : 'is-empty'
                          } ${isHovered ? 'is-hovered' : ''}`}
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
                              className={`cell-fall-wrapper ${
                                cell.isLanded ? 'landed' : 'falling'
                              }`}
                            >
                              <TetrisBlock
                                color={cell.project.color}
                                size="100%"
                                isGhost={!cell.isLanded}
                                isSolved={isSolved}
                                label={cell.isLanded ? cell.project.title.slice(0, 4) : ''}
                              />
                            </div>
                          ) : (
                            <div className="matrix-cell-empty-dot" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Solved celebration banner */}
            {isSolved && (
              <div className="board-solved-banner">
                <span className="solved-flash">★ ALL 8 REPOSITORIES SOLVED & LOCKED IN! ★</span>
                <span className="solved-bonus">+10,000 PTS BONUS AWARDED // CLICK ANY BLOCK FOR CODE</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick-Pill Bar for 8 Projects */}
        <div className="projects-quick-selector">
          <div className="selector-label">
            <span>REPOSITORY QUICK SELECTOR:</span>
          </div>
          <div className="selector-pills">
            {PROJECTS.map((project, idx) => {
              const isLanded = idx < landedCount;
              const isHovered = hoveredProjectId === project.id;

              return (
                <button
                  key={project.id}
                  type="button"
                  className={`project-pill-btn ${isLanded ? 'landed' : 'pending'} ${
                    isHovered ? 'active' : ''
                  }`}
                  style={{
                    borderLeftColor: project.color,
                    boxShadow: isHovered ? `0 0 12px ${project.color}` : 'none'
                  }}
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                >
                  <span className="pill-dot" style={{ backgroundColor: project.color }} />
                  <span className="pill-title">{project.title}</span>
                  <span className="pill-ext">↗</span>
                </button>
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
    </div>
  );
};
