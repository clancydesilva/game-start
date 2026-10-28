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
  // Scoped ref for the Game View scroll zone
  const gameViewRef = useRef<HTMLDivElement>(null);

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
  const [simultaneousUnlockBanner, setSimultaneousUnlockBanner] = useState<string | null>(null);

  const totalProjects = PROJECTS.length;
  const currentProject: ProjectItem | null =
    currentProjectIndex < totalProjects ? PROJECTS[currentProjectIndex] : null;
  const nextProject: ProjectItem | null =
    currentProjectIndex + 1 < totalProjects ? PROJECTS[currentProjectIndex + 1] : null;

  // Calculate coordinates of the currently active falling piece based on motionStep (0 to 4)
  const getActivePieceCells = useCallback((): GridCell[] => {
    if (!currentProject) return [];

    const finalCells = currentProject.solvedCells;
    const finalMinX = Math.min(...finalCells.map((c) => c.x));
    const finalMinY = Math.min(...finalCells.map((c) => c.y));

    const relCells = finalCells.map((c) => ({
      x: c.x - finalMinX,
      y: c.y - finalMinY
    }));

    if (motionStep === 0) {
      // Top center
      const spawnX = Math.max(0, Math.floor((TETRIS_COLS - 3) / 2));
      return relCells.map((c) => ({ x: spawnX + c.x, y: c.y }));
    } else if (motionStep === 1) {
      // Step 1: Moves down
      const spawnX = Math.max(0, Math.floor((TETRIS_COLS - 3) / 2));
      return relCells.map((c) => ({ x: spawnX + c.x, y: c.y + 2 }));
    } else if (motionStep === 2) {
      // Step 2: Rotates / Turns
      const targetMidX = Math.round((finalMinX + 1) / 2);
      return relCells.map((c) => ({
        x: Math.min(TETRIS_COLS - 1, Math.max(0, targetMidX + c.y)),
        y: Math.min(TETRIS_ROWS - 1, c.x + 3)
      }));
    } else if (motionStep === 3) {
      // Step 3: Shifts horizontally toward target columns
      return relCells.map((c) => ({
        x: finalMinX + c.x,
        y: Math.max(0, finalMinY - 2 + c.y)
      }));
    } else {
      // Step 4: Final resting landing cells
      return finalCells;
    }
  }, [currentProject, motionStep]);

  // Advance game by 1 step
  const advanceStep = useCallback(() => {
    if (isGameOver || !currentProject) return;

    if (motionStep < 3) {
      const nextStep = motionStep + 1;
      setMotionStep(nextStep);
      if (nextStep === 2 || nextStep === 3) {
        sfx.playRotate();
      }
    } else if (motionStep === 3) {
      // Piece lands
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

      const piecePoints = currentProject.points || 1500;
      setScore((prev) => {
        const nextScore = prev + piecePoints;
        onScoreChange?.(nextScore);
        return nextScore;
      });

      // Check for completely filled rows across all 6 columns
      const filledRowIndices: number[] = [];
      for (let r = 0; r < TETRIS_ROWS; r++) {
        const cellsInRow = updatedLanded.flatMap((p) =>
          p.isDestroyed ? [] : p.cells.filter((c) => c.y === r)
        );
        const uniqueCols = new Set(cellsInRow.map((c) => c.x));
        if (uniqueCols.size >= TETRIS_COLS) {
          filledRowIndices.push(r);
        }
      }

      if (filledRowIndices.length > 0) {
        // Line clear!
        setClearingRowIndices(filledRowIndices);
        sfx.playLineClear();

        setLines((prev) => prev + filledRowIndices.length);
        setScore((prev) => {
          const bonus = prev + filledRowIndices.length * 3000;
          onScoreChange?.(bonus);
          return bonus;
        });

        // Find all projects that had blocks in ANY of the cleared lines
        const newlyUnlockedProjects = updatedLanded
          .filter((p) => p.cells.some((c) => filledRowIndices.includes(c.y)))
          .map((p) => p.project.id);

        const uniqueNewlyUnlocked = [
          ...new Set(newlyUnlockedProjects.filter((id) => !clearedProjectIds.includes(id)))
        ];

        if (uniqueNewlyUnlocked.length > 1) {
          setSimultaneousUnlockBanner(
            `★ MULTI-UNLOCK! ${uniqueNewlyUnlocked.length} PROJECTS UNLOCKED AT ONCE! ★`
          );
          setTimeout(() => setSimultaneousUnlockBanner(null), 3000);
        }

        setTimeout(() => {
          setLandedPieces((prev) =>
            prev.map((p) =>
              newlyUnlockedProjects.includes(p.project.id)
                ? { ...p, isDestroyed: true }
                : p
            )
          );
          setClearedProjectIds((prev) => [
            ...new Set([...prev, ...newlyUnlockedProjects])
          ]);
          setClearingRowIndices([]);
        }, 650);
      }

      // Next project
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
    clearedProjectIds,
    onScoreChange
  ]);

  // Step backwards
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

  // SCROLL ZONE 1: Game View Scroll Zone
  // The wheel listener is scoped ONLY to gameViewRef.
  // Scrolling here advances the block and prevents normal page scroll.
  useEffect(() => {
    const gameElem = gameViewRef.current;
    if (!gameElem) return;

    let wheelAccum = 0;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Stop window scroll only within the game view zone
      e.stopPropagation();
      wheelAccum += e.deltaY;

      if (wheelAccum > 24) {
        advanceStep();
        wheelAccum = 0;
      } else if (wheelAccum < -24) {
        stepBack();
        wheelAccum = 0;
      }
    };

    gameElem.addEventListener('wheel', handleWheel, { passive: false });
    return () => gameElem.removeEventListener('wheel', handleWheel);
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
    setSimultaneousUnlockBanner(null);
    onScoreChange?.(0);
  };

  // Build grid map for the 6x8 board
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
    <div className="tetris-arcade-layout-wrapper" id="projects-arcade">
      {/* Top Arcade HUD Header */}
      <div className="arcade-cabinet-header">
        <div className="arcade-title-box">
          <span className="arcade-sub">STAGE 01 // INTERACTIVE TETRIS MATRIX</span>
          <h2 className="arcade-main-title">
            <span className="title-tetris">TETRIS</span> REPOSITORY ENGINE
          </h2>
          <p className="arcade-instruction">
            3 SCROLL ZONES: HOVER GAME TO ADVANCE • HOVER SIDEBAR TO BROWSE • SCROLL OUTSIDE FOR SITE
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

      {/* Control Action Buttons & Multi-Unlock Notification */}
      <div className="arcade-controls-bar">
        <button
          className="retro-btn btn-sm btn-primary"
          onClick={advanceStep}
          disabled={isGameOver}
          title="Click or scroll wheel over game view to advance"
        >
          <span>▼ ADVANCE PIECE</span>
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

        {simultaneousUnlockBanner && (
          <div className="simultaneous-unlock-banner">
            <span>{simultaneousUnlockBanner}</span>
          </div>
        )}
      </div>

      {/* 2-Column Arena Grid */}
      <div className="arcade-arena-grid">
        {/* SCROLL ZONE 1: Left Column Game View */}
        <div ref={gameViewRef} className="arcade-board-column scroll-zone-game">
          <div className="scroll-zone-badge game-zone">
            <span>🕹️ SCROLL ZONE 1: GAME ADVANCEMENT</span>
          </div>

          <div className="tetris-board-frame">
            <div className="board-top-marquee">
              <span>● 6-COLUMN PURE SQUARE MATRIX ●</span>
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
              <span>★ HOVER & WHEEL SCROLL TO ADVANCE PIECES ★</span>
            </div>
          </div>

          {/* NEXT PIECE PREVIEW BOX */}
          <NextPieceBox nextProject={nextProject} />
        </div>

        {/* SCROLL ZONE 2: Right Column (Projects List with independent scroll) */}
        <div className="arcade-queue-sidebar scroll-zone-projects">
          <div className="scroll-zone-badge projects-zone">
            <span>📋 SCROLL ZONE 2: PROJECT DIRECTORY</span>
          </div>

          <div className="queue-header">
            <div>
              <span className="queue-title">CLEARED REPOSITORIES</span>
              <p className="queue-sub">
                FILL A ROW TO DESTROY BLOCKS & UNLOCK PROJECTS (MULTIPLE CAN UNLOCK AT ONCE!)
              </p>
            </div>
            <span className="unlocked-counter-badge">
              {clearedProjectIds.length} / {totalProjects} UNLOCKED
            </span>
          </div>

          {/* Independent scroll container for projects */}
          <div className="project-queue-list custom-scrollbar">
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
