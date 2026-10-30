import React from 'react';
import type { ProjectItem } from '../../types';
import { TetrisBlock } from './TetrisBlock';

interface NextPieceBoxProps {
  nextProject: ProjectItem | null;
}

const PREVIEW_SHAPES: Record<string, { x: number; y: number }[]> = {
  T: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
  O: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  L: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  S: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  I: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
  Z: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
  J: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }]
};

export const NextPieceBox: React.FC<NextPieceBoxProps> = ({ nextProject }) => {
  if (!nextProject) {
    return (
      <div className="next-piece-box">
        <span className="next-title">NEXT PIECE</span>
        <div className="next-matrix-empty">NONE</div>
      </div>
    );
  }

  const normalizedCells = PREVIEW_SHAPES[nextProject.type] || PREVIEW_SHAPES.O;
  const maxX = Math.max(...normalizedCells.map((c) => c.x));
  const maxY = Math.max(...normalizedCells.map((c) => c.y));

  const cols = Math.max(4, maxX + 1);
  const rows = Math.max(2, maxY + 1);

  return (
    <div className="next-piece-box">
      <div className="next-header">
        <span className="next-title">NEXT PIECE</span>
        <span className="next-type" style={{ color: nextProject.color }}>
          {nextProject.type}-PIECE
        </span>
      </div>

      <div
        className="next-matrix-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 20px)`,
          gridTemplateRows: `repeat(${rows}, 20px)`
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const isFilled = normalizedCells.some(
              (cell) => cell.x === c && cell.y === r
            );

            return (
              <div key={`${r}-${c}`} className="next-cell-slot">
                {isFilled ? (
                  <TetrisBlock color={nextProject.color} size={20} />
                ) : (
                  <div className="next-empty-dot" />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="next-project-label" style={{ color: nextProject.color }}>
        {nextProject.title}
      </div>
    </div>
  );
};
