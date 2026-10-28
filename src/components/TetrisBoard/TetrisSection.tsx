import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ProjectItem, GridCell } from '../../types';
import { PROJECTS, TETRIS_COLS, TETRIS_ROWS } from '../../utils/constants';
import { TetrisBlock } from './TetrisBlock';
import { NextPieceBox } from './NextPieceBox';
import { ProjectModal } from './ProjectModal';
import { sfx } from '../../utils/sfx';

interface TetrisSectionProps {
  onScoreChange?: (score: number) => void;
}

interface LandedPiece {
  project: ProjectItem;
  cells: GridCell[];
  isDestroyed: boolean;
}

export const TetrisSection: React.FC<TetrisSectionProps> = ({ onScoreChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active game state
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0);
  const [motionStep, setMotionStep] = useState<number>(0); // 0 to 4
  const [landedPieces, setLandedPieces] = useState<LandedPiece[]>([]);
  const [clearedProjectIds, setClearedProjectIds] = useState<string[]>([]);
  const [clearingRowIndices, setClearingRowIndices] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  const totalProjects = PROJECTS.length;
  const currentProject: ProjectItem | null =
    currentProjectIndex < totalProjects ? PROJECTS[currentProjectIndex] : null;
  const nextProject: ProjectItem | null =
    currentProjectIndex + 1 < totalProjects ? PROJECTS[currentProjectIndex + 1] : null;

  // Calculate coordinates of the currently active falling piece based on motionStep (0 to 4)
  // Step 0: Spawn at top (y: 0, 1), centered
  // Step 1: Moves down (y: 2, 3)
  // Step 2: Rotates / Turns (sfx.playRotate())
  // Step 3: Shifts horizontally to target column
  // Step 4: Lands in target resting position (sfx.playDrop())
  const getActivePieceCells = useCallback((): GridCell[] => {
    if (!currentProject) return [];

    const finalCells = currentProject.solvedCells;
    const finalMinX = Math.min(...finalCells.map((c) => c.x));
    const finalMinY = Math.min(...finalCells.map((c) => c.y));

    // Normalized relative offsets from (0,0)
    const relCells = finalCells.map((c) => ({
      x: c.x - finalMinX,
      y: c.y - finalMinY
    }));

    if (motionStep === 0) {
      // Top center
      const spawnX = Math.max(0, Math.floor((TETRIS_COLS - 3) / 2));
      return relCells.map((c) => ({ x: spawnX + c.x, y: c.y }));
    } else if (motionStep === 1) {
      // Down two rows
      const spawnX = Math.max(0, Math.floor((TETRIS_COLS - 3) / 2));
      return relCells.map((c) => ({ x: spawnX + c.x, y: c.y + 2 }));
    } else if (motionStep === 2) {
      // Rotated / turned state
      const targetMidX = Math.round((finalMinX + 1) / 2);
      return relCells.map((c) => ({
        // Predetermined turn: swap x & y delta for visual rotation
        x: Math.min(TETRIS_COLS - 1, Math.max(0, targetMidX + c.y)),
        y: Math.min(TETRIS_ROWS - 1, c.x + 3)
      }));
    } else if (motionStep === 3) {
      // Shifted horizontally above target column
      return relCells.map((c) => ({
        x: finalMinX + c.x,
        y: Math.max(0, finalMinY - 2 + c.y)
      }));
    } else {
      // Step 4: Final resting landing cells
      return finalCells;
    }
  }, [currentProject, motionStep]);

  // Advance game by 1 step (driven by mouse wheel, keydown, or button)
  const advanceStep = useCallback(() => {
    if (isGameOver || !currentProject) return;

    if (motionStep < 3) {
      // Intermediate falling & turning steps
      const nextStep = motionStep + 1;
      setMotionStep(nextStep);
      if (nextStep === 2 || nextStep === 3) {
        sfx.playRotate();
      }
    } else if (motionStep === 3) {
      // Piece LANDS in resting slot
      sfx.playDrop();
      setMotionStep(4);

      const landedCells = currentProject.solvedCells;
      const newLandedPiece: LandedPiece = {
        project: currentProject,
        cells: landedCells,
        isDestroyed: false
      };

      const updatedLanded = [...landedPieces, newLandedPiece];
      setLandedPieces(updatedLanded);

      // Score for piece drop
      const piecePoints = currentProject.points || 1500;
      setScore((prev) => {
        const nextScore = prev + piecePoints;
        onScoreChange?.(nextScore);
        return nextScore;
      });

      // Check if rows are now completely filled across all 6 columns
      // Check each row from 0 to TETRIS_ROWS - 1
      const filledRowIndices: number[] = [];
      for (let r = 0; r < TETRIS_ROWS; r++) {
        // Collect all non-destroyed landed cells in row r
        const cellsInRow = updatedLanded.flatMap((p) =>
          p.isDestroyed ? [] : p.cells.filter((c) => c.y === r)
        );
        // All 6 columns filled?
        const uniqueCols = new Set(cellsInRow.map((c) => c.x));
        if (uniqueCols.size >= TETRIS_COLS) {
          filledRowIndices.push(r);
        }
      }

      if (filledRowIndices.length > 0) {
        // LINE CLEAR!
        setClearingRowIndices(filledRowIndices);
        sfx.playLineClear();

        setLines((prev) => prev + filledRowIndices.length);
        setScore((prev) => {
          const bonus = prev + filledRowIndices.length * 3000;
          onScoreChange?.(bonus);
          return bonus;
        });

        // Identify which projects have blocks in these completed lines
        const projectsInCompletedRows = updatedLanded
          .filter((p) => p.cells.some((c) => filledRowIndices.includes(c.y)))
          .map((p) => p.project.id);

        setTimeout(() => {
          // Mark completed lines as destroyed & unlock project into normal divs
          setLandedPieces((prev) =>
            prev.map((p) =>
              projectsInCompletedRows.includes(p.project.id)
                ? { ...p, isDestroyed: true }
                : p
            )
          );
          setClearedProjectIds((prev) => [
            ...new Set([...prev, ...projectsInCompletedRows])
          ]);
          setClearingRowIndices([]);
        }, 650);
      }

      // Prepare next project
      setTimeout(() => {
        if (currentProjectIndex + 1 < totalProjects) {
          setCurrentProjectIndex((prev) => prev + 1);
          setMotionStep(0);
        } else {
          setIsGameOver(true);
          sfx.playLineClear();
        }
      }, 500);
    }
  }, [
    isGameOver,
    currentProject,
    motionStep,
    landedPieces,
    currentProjectIndex,
    totalProjects,
    onScoreChange
  ]);

  // Step backwards (for undo / rewind)
  const stepBack = useCallback(() => {
    if (motionStep > 0) {
      sfx.playRotate();
      setMotionStep((prev) => prev - 1);
    }
  }, [motionStep]);

  // Auto-play interval
  useEffect(() => {
    if (!autoPlay || isGameOver) return;
    const interval = window.setInterval(() => {
      advanceStep();
    }, 450);
    return () => clearInterval(interval);
  }, [autoPlay, isGameOver, advanceStep]);

  // Scroll interception: Scrolling advances block down (no window scrolling)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelAccum = 0;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccum += e.deltaY;

      // Every 30px of scroll delta advances 1 step
      if (wheelAccum > 28) {
        advanceStep();
        wheelAccum = 0;
      } else if (wheelAccum < -28) {
        stepBack();
        wheelAccum = 0;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [advanceStep, stepBack]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        advanceStep();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        stepBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceStep, stepBack]);

  const handleResetGame = () => {
    sfx.playBeep();
    setCurrentProjectIndex(0);
    setMotionStep(0);
    setLandedPieces([]);
    setClearedProjectIds([]);
    setClearingRowIndices([]);
    setScore(0);
    setLines(0);
    setIsGameOver(false);
    setAutoPlay(false);
    onScoreChange?.(0);
  };

  // Build grid map for the 6x8 board
  // Each cell: { project, isLanded, isFalling, isClearedRow }
  const activeCells = motionStep < 4 ? getActivePieceCells() : [];

  const gridMatrix: {
    project: ProjectItem | null;
    isLanded: boolean;
    isFalling: boolean;
    isClearedRow: boolean;
  }[][] = Array.from({ length: TETRIS_ROWS }, (_, y) =>
    Array.from({ length: TETRIS_COLS }, (_, x) => {
      const isClearedRow = clearingRowIndices.includes(y);

      // Check if active falling piece occupies (x, y)
      const isActive = activeCells.some((c) => c.x === x && c.y === y);
      if (isActive && currentProject) {
        return {
          project: currentProject,
          isLanded: false,
          isFalling: true,
          isClearedRow
        };
      }

      // Check if landed piece occupies (x, y)
      for (const landed of landedPieces) {
        if (!landed.isDestroyed && landed.cells.some((c) => c.x === x && c.y === y)) {
          return {
            project: landed.project,
            isLanded: true,
            isFalling: false,
            isClearedRow
          };
        }
      }

      return {
        project: null,
        isLanded: false,
        isFalling: false,
        isClearedRow
      };
    })
  );

  return (
    <div ref={containerRef} className="tetris-arcade-layout-wrapper" id="projects-arcade">
      {/* Top Arcade HUD Header */}
      <div className="arcade-cabinet-header">
        <div className="arcade-title-box">
          <span className="arcade-sub">STAGE 01 // INTERACTIVE TETRIS MATRIX</span>
          <h2 className="arcade-main-title">
            <span className="title-tetris">TETRIS</span> REPOSITORY ENGINE
          </h2>
          <p className="arcade-instruction">
            SCROLL DOWN WITH MOUSE WHEEL TO ADVANCE BLOCKS • FILL A LINE TO DESTROY BLOCK & UNLOCK REPOSITORY
          </p>
        </div>

        {/* HUD Score Panel */}
        <div className="arcade-hud-panel">
          <div className="hud-metric">
            <span className="hud-label">SCORE</span>
            <span className="hud-value hud-score">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">LINES</span>
            <span className="hud-value hud-lines">{lines}</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">UNLOCKED</span>
            <span className="hud-value hud-unlocked">
              {clearedProjectIds.length} / {totalProjects}
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">STATUS</span>
            <span className={`hud-value ${isGameOver ? 'hud-solved' : 'hud-active'}`}>
              {isGameOver ? '★ COMPLETED ★' : 'IN PLAY'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="arcade-controls-bar">
        <button
          className="retro-btn btn-sm btn-primary"
          onClick={advanceStep}
          disabled={isGameOver}
          title="Scroll mouse wheel down or click to advance"
        >
          <span>▼ ADVANCE (OR SCROLL)</span>
        </button>
        <button
          className={`retro-btn btn-sm ${autoPlay ? 'btn-active' : ''}`}
          onClick={() => {
            sfx.playBeep();
            setAutoPlay((prev) => !prev);
          }}
        >
          <span>{autoPlay ? '⏸ PAUSE' : '▶ AUTO PLAY'}</span>
        </button>
        <button className="retro-btn btn-sm btn-outline" onClick={handleResetGame}>
          <span>↺ RESET GAME</span>
        </button>
        <div className="scroll-hint-tag">
          <span>↕ WHEEL SCROLL ADVANCES BLOCK</span>
        </div>
      </div>

      {/* The Restored 2-Column Layout */}
      <div className="arcade-arena-grid">
        {/* LEFT COLUMN: The 6-Column Square Tetris Board + Next Piece */}
        <div className="arcade-board-column">
          <div className="tetris-board-frame">
            <div className="board-top-marquee">
              <span>● 6-COLUMN SQUARE MATRIX ●</span>
            </div>

            <div className="tetris-grid-container">
              {/* Matrix Columns 01 - 06 */}
              <div className="grid-col-headers">
                {Array.from({ length: TETRIS_COLS }).map((_, c) => (
                  <div key={c} className="col-header-cell">
                    0{c + 1}
                  </div>
                ))}
              </div>

              {/* Pure Square Matrix Grid */}
              <div className="grid-matrix-body square-cells">
                {gridMatrix.map((row, y) => (
                  <div key={y} className="grid-matrix-row">
                    {row.map((cell, x) => {
                      const canClick = cell.project && cell.isLanded;

                      return (
                        <div
                          key={x}
                          className={`grid-cell-slot ${cell.project ? 'has-piece' : ''} ${
                            cell.isLanded ? 'cell-landed is-clickable' : ''
                          } ${cell.isFalling ? 'cell-falling' : ''} ${
                            cell.isClearedRow ? 'row-clearing-flash' : ''
                          }`}
                          onClick={() => {
                            // Block is ONLY clickable when it has stopped moving (isLanded)
                            if (canClick && cell.project) {
                              setSelectedProject(cell.project);
                            }
                          }}
                          title={
                            canClick
                              ? `${cell.project?.title} (Click to inspect details)`
                              : cell.isFalling
                              ? 'Moving... (Clickable when stopped)'
                              : undefined
                          }
                        >
                          {cell.project ? (
                            <TetrisBlock
                              color={cell.project.color}
                              size="100%"
                              isGhost={cell.isFalling}
                              label={cell.isLanded ? cell.project.title.slice(0, 3) : ''}
                            />
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

            <div className="board-sub-note">
              <span>★ BLOCKS ARE ONLY CLICKABLE ONCE STOPPED ★</span>
            </div>
          </div>

          {/* NEXT PIECE PREVIEW BOX */}
          <NextPieceBox nextProject={nextProject} />
        </div>

        {/* RIGHT COLUMN: The Normal Divs (Cleared Projects & Queue) */}
        <div className="arcade-queue-sidebar">
          <div className="queue-header">
            <div>
              <span className="queue-title">CLEARED REPOSITORIES</span>
              <p className="queue-sub">
                FILL A ROW IN TETRIS TO DESTROY BLOCKS & UNLOCK NORMAL PROJECT SECTIONS
              </p>
            </div>
            <span className="unlocked-counter-badge">
              {clearedProjectIds.length} / {totalProjects} UNLOCKED
            </span>
          </div>

          <div className="project-queue-list">
            {PROJECTS.map((project) => {
              const isCleared = clearedProjectIds.includes(project.id);
              const isLandedOnBoard = landedPieces.some(
                (p) => p.project.id === project.id && !p.isDestroyed
              );
              const isCurrentlyFalling = currentProject?.id === project.id;

              return (
                <div
                  key={project.id}
                  className={`project-normal-div ${
                    isCleared ? 'is-unlocked-div' : 'is-pending-div'
                  }`}
                  style={{ borderLeftColor: project.color }}
                >
                  {/* Div Header */}
                  <div className="pnd-header">
                    <div className="pnd-title-group">
                      <span className="pnd-pill" style={{ backgroundColor: project.color }}>
                        {project.type}-PIECE
                      </span>
                      <h4 className="pnd-title" style={{ color: project.color }}>
                        {project.title}
                      </h4>
                    </div>

                    <div className="pnd-status-badge">
                      {isCleared ? (
                        <span className="badge-cleared">★ UNLOCKED ★</span>
                      ) : isLandedOnBoard ? (
                        <span className="badge-board">ON BOARD (CLICK BLOCK)</span>
                      ) : isCurrentlyFalling ? (
                        <span className="badge-falling">FALLING...</span>
                      ) : (
                        <span className="badge-locked">🔒 IN QUEUE</span>
                      )}
                    </div>
                  </div>

                  {/* Div Body: Description and Details */}
                  {isCleared ? (
                    // Unlocked normal div with full clickable section
                    <div className="pnd-unlocked-body">
                      <p className="pnd-tagline">{project.tagline}</p>
                      <p className="pnd-desc">{project.description}</p>

                      <div className="pnd-tags-row">
                        {project.tags.map((t, ti) => (
                          <span key={ti} className="mini-tag">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="pnd-actions-row">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="retro-btn btn-xs btn-primary"
                          onClick={() => sfx.playCoin()}
                        >
                          <span>GITHUB REPO</span> ↗
                        </a>
                        <button
                          type="button"
                          className="retro-btn btn-xs btn-outline"
                          onClick={() => setSelectedProject(project)}
                        >
                          <span>INSPECT</span> 🔍
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Not cleared yet: Notice that the only link is on the block itself
                    <div className="pnd-locked-body">
                      <p className="pnd-tagline">{project.tagline}</p>
                      <div className="pnd-lock-notice">
                        {isLandedOnBoard ? (
                          <span className="notice-board">
                            ▶ Block has landed on matrix! Click the block directly to inspect.
                          </span>
                        ) : (
                          <span className="notice-queue">
                            ▶ Advance block & fill line to destroy piece and unlock full details here.
                          </span>
                        )}
                      </div>
                    </div>
                  )}
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
    </div>
  );
};
