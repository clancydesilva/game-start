import React, { useEffect } from 'react';
import type { ProjectItem } from '../../types';
import { TetrisBlock } from './TetrisBlock';
import { sfx } from '../../utils/sfx';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (project) {
      sfx.playRotate();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          sfx.playBeep();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="retro-modal-backdrop" onClick={onClose}>
      <div
        className="retro-modal-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="retro-modal-header" style={{ borderColor: project.color }}>
          <div className="modal-header-left">
            <span className="modal-status-dot" style={{ backgroundColor: project.color }} />
            <span className="modal-header-title">PROJECT_INFO.EXE</span>
          </div>
          <button
            className="retro-modal-close-btn"
            onClick={() => {
              sfx.playBeep();
              onClose();
            }}
            aria-label="Close"
          >
            [X]
          </button>
        </div>

        <div className="retro-modal-body">
          <div className="modal-hero-row">
            <div className="modal-tetromino-preview">
              <div className="preview-shape-matrix">
                {project.solvedCells.map((_, i) => (
                  <div key={i} className="mini-block-wrap">
                    <TetrisBlock color={project.color} size={28} />
                  </div>
                ))}
              </div>
              <span className="preview-type-badge" style={{ color: project.color }}>
                {project.type}-PIECE
              </span>
            </div>

            <div className="modal-title-col">
              <div className="modal-badge-row">
                <span className="modal-score-badge">+{project.points} PTS</span>
                <span className="modal-metric-badge">{project.metrics}</span>
              </div>
              <h2 id="modal-title" className="modal-project-title" style={{ color: project.color }}>
                {project.title}
              </h2>
              <p className="modal-tagline">{project.tagline}</p>
            </div>
          </div>

          <div className="modal-divider" />

          <div className="modal-description-section">
            <h4 className="modal-subheading">MISSION OBJECTIVE:</h4>
            <p className="modal-desc-text">{project.description}</p>
          </div>

          <div className="modal-tags-section">
            <h4 className="modal-subheading">TECH SPECIFICATION:</h4>
            <div className="modal-tags-list">
              {project.tags.map((t, idx) => (
                <span key={idx} className="modal-tag-chip">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="modal-actions-row">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn btn-primary"
              onClick={() => sfx.playCoin()}
            >
              <span>SOURCE REPO</span> ↗
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn btn-secondary"
                onClick={() => sfx.playCoin()}
              >
                <span>LIVE PREVIEW</span> [▶]
              </a>
            )}
            <button
              className="retro-btn btn-outline"
              onClick={() => {
                sfx.playBeep();
                onClose();
              }}
            >
              RETURN TO BOARD
            </button>
          </div>
        </div>

        <div className="retro-modal-footer">
          <span>PRESS [ESC] TO CLOSE</span>
          <span>LEVEL 99 ARCHITECT</span>
        </div>
      </div>
    </div>
  );
};
