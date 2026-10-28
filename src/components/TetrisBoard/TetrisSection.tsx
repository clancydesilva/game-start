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

  const prevLandedRef = useRef<number>(0);
  const totalProjects = PROJECTS.length; // 8 real projects

  // Scroll detection to trigger falling pieces
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start dropping when section enters view
      const topOffset = rect.top;
      const totalScrollable = rect.height - windowHeight * 0.3;
      
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
    <section ref={containerRef} className="tetris-fullscreen-section" id="projects-arcade">
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
          <span className="hud-label">MATRIX STATUS</span>
          <span className={`hud-value ${isSolved ? 'hud-solved' : 'hud-active'}`}>
            {isSolved ? '★ 100% SOLVED ★' : 'IN PLAY'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
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

      {/* Dominant Screen-Filling 6-Column Tetris Board */}
      <div className="tetris-fullscreen-board-container">
        <div className="board-outer-bezel">
          <div className="board-top-marquee">
            <span>● 6-COLUMN SOLVED MATRIX // CLANCY DESILVA REPOSITORIES ●</span>
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
                              label={cell.isLanded ? cell.project.title.slice(0, 3) : ''}
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

      {/* Roster of 8 Real Projects Quick-Pill Bar */}
      <div className="projects-quick-selector">
        <div className="selector-label">
          <span>GITHUB REPOSITORIES:</span>
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

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
