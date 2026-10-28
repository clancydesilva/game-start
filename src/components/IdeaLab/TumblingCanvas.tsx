import React, { useEffect, useRef } from 'react';
import type { IdeaItem } from '../../types';
import { sfx } from '../../utils/sfx';

interface TumblingCanvasProps {
  ideas: IdeaItem[];
  onSelectIdea: (idea: IdeaItem) => void;
  selectedIdeaId: string | null;
}

interface TumblingPiece {
  idea: IdeaItem;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  size: number;
  matrix: number[][];
}

// 2D matrix shapes for tetrominoes
const SHAPE_MATRICES: Record<string, number[][]> = {
  I: [
    [1, 1, 1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1]
  ]
};

export const TumblingCanvas: React.FC<TumblingCanvasProps> = ({
  ideas,
  onSelectIdea,
  selectedIdeaId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<TumblingPiece[]>([]);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 800;
    const height = 300;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    // Initialize loose tumbling pieces
    piecesRef.current = ideas.map((idea, idx) => {
      const matrix = SHAPE_MATRICES[idea.type] || SHAPE_MATRICES.T;
      return {
        idea,
        x: (width / (ideas.length + 1)) * (idx + 1),
        y: 40 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.2,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.04,
        size: 16,
        matrix
      };
    });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(32, now - lastTime) / 16;
      lastTime = now;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Draw faint arcade grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const cellSize = 24;
      for (let x = 0; x < w; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Update & render tumbling pieces
      piecesRef.current.forEach((piece) => {
        // Apply mild physics
        piece.x += piece.vx * dt;
        piece.y += piece.vy * dt;
        piece.angle += piece.vAngle * dt;

        // Bounce off walls
        const margin = 40;
        if (piece.x < margin) {
          piece.x = margin;
          piece.vx = Math.abs(piece.vx) * 0.95;
        } else if (piece.x > w - margin) {
          piece.x = w - margin;
          piece.vx = -Math.abs(piece.vx) * 0.95;
        }

        if (piece.y < margin) {
          piece.y = margin;
          piece.vy = Math.abs(piece.vy) * 0.95;
        } else if (piece.y > h - margin) {
          piece.y = h - margin;
          piece.vy = -Math.abs(piece.vy) * 0.95;
        }

        // Draw the tumbling tetromino piece
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.angle);

        const isSelected = piece.idea.id === selectedIdeaId;
        const bs = piece.size;
        const mat = piece.matrix;
        const rows = mat.length;
        const cols = mat[0].length;
        const offsetX = -(cols * bs) / 2;
        const offsetY = -(rows * bs) / 2;

        if (isSelected) {
          // Glow outline
          ctx.shadowColor = piece.idea.color;
          ctx.shadowBlur = 16;
        }

        mat.forEach((r, rowIdx) => {
          r.forEach((val, colIdx) => {
            if (val === 1) {
              const bx = offsetX + colIdx * bs;
              const by = offsetY + rowIdx * bs;

              // Core block
              ctx.fillStyle = piece.idea.color;
              ctx.fillRect(bx, by, bs, bs);

              // 3D Bevel highlight
              ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
              ctx.fillRect(bx, by, bs, 3);
              ctx.fillRect(bx, by, 3, bs);

              // 3D Bevel shadow
              ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
              ctx.fillRect(bx, by + bs - 3, bs, 3);
              ctx.fillRect(bx + bs - 3, by, 3, bs);

              // Black border
              ctx.strokeStyle = '#000000';
              ctx.lineWidth = 1.5;
              ctx.strokeRect(bx, by, bs, bs);
            }
          });
        });

        // Idea Label under piece
        ctx.shadowBlur = 0;
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(piece.idea.type + '-IDEA', 0, offsetY + rows * bs + 16);

        ctx.restore();
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [ideas, selectedIdeaId]);

  // Handle canvas click to select tumbling piece
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find nearest piece
    for (const piece of piecesRef.current) {
      const dist = Math.hypot(piece.x - clickX, piece.y - clickY);
      if (dist < 45) {
        sfx.playRotate();
        // Give piece a gentle impulse
        piece.vx += (Math.random() - 0.5) * 4;
        piece.vy -= 2;
        onSelectIdea(piece.idea);
        return;
      }
    }
  };

  return (
    <div className="tumbling-canvas-container">
      <div className="tumbling-header-note">
        <span>▼ TUMBLING PIECES ARE UNFINISHED EXPERIMENTS — CLICK TO INTERACT ▼</span>
      </div>
      <canvas
        ref={canvasRef}
        className="tumbling-canvas"
        onClick={handleCanvasClick}
        title="Click loose tumbling pieces to interact"
      />
    </div>
  );
};
