import React, { useState } from 'react';
import type { IdeaItem } from '../../types';
import { sfx } from '../../utils/sfx';

interface CollabModalProps {
  idea: IdeaItem | null;
  onClose: () => void;
}

export const CollabModal: React.FC<CollabModalProps> = ({ idea, onClose }) => {
  const [handle, setHandle] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  if (!idea) return null;

  const cleanHandle = handle.replace(/^@/, '').trim();
  const titleParam = encodeURIComponent(`[COLLAB REQUEST] ${idea.title} - @${cleanHandle || 'collaborator'}`);
  const bodyText = `### [IDEA LAB] Collaboration Request

**Target Project / Idea:** ${idea.title}
**Shape / Type:** ${idea.type}-Piece (${idea.stage})
**Collaborator GitHub Handle:** @${cleanHandle || 'anonymous'}

---

### Notes & Proposed Contribution:
${note || 'I would love to collaborate on prototyping this idea with you!'}

---
*Generated via Clancy DeSilva Portfolio Arcade Idea Lab*`;

  const bodyParam = encodeURIComponent(bodyText);
  const githubIssueUrl = `https://github.com/${idea.githubRepo}/issues/new?title=${titleParam}&body=${bodyParam}&labels=collab-quest,idea-lab`;

  const handleCopyMarkdown = () => {
    sfx.playBeep();
    navigator.clipboard.writeText(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playCoin();
    window.open(githubIssueUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="retro-modal-backdrop" onClick={onClose}>
      <div
        className="retro-modal-window collab-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="retro-modal-header" style={{ borderColor: idea.color }}>
          <div className="modal-header-left">
            <span className="modal-status-dot" style={{ backgroundColor: idea.color }} />
            <span className="modal-header-title">INITIATE_COLLAB_QUEST.BAT</span>
          </div>
          <button
            className="retro-modal-close-btn"
            onClick={() => {
              sfx.playBeep();
              onClose();
            }}
          >
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="retro-modal-body">
          <div className="collab-idea-banner">
            <span className="collab-pill" style={{ color: idea.color }}>
              {idea.stage}
            </span>
            <h3 className="collab-idea-title" style={{ color: idea.color }}>
              {idea.title}
            </h3>
            <p className="collab-idea-pitch">{idea.pitch}</p>
          </div>

          <div className="collab-form-group">
            <label className="retro-label" htmlFor="github-handle">
              YOUR GITHUB HANDLE:
            </label>
            <div className="input-with-prefix">
              <span className="input-prefix">@</span>
              <input
                id="github-handle"
                type="text"
                className="retro-input"
                placeholder="torvalds"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="collab-form-group">
            <label className="retro-label" htmlFor="collab-note">
              COLLABORATION NOTE / PITCH:
            </label>
            <textarea
              id="collab-note"
              className="retro-textarea"
              rows={4}
              placeholder="Hey Clancy! I've been experimenting with WebGPU compute shaders and would love to co-build the voxel physics engine..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          <div className="collab-preview-box">
            <div className="preview-label-bar">
              <span>PRE-FILLED GITHUB ISSUE PREVIEW</span>
              <button
                type="button"
                className="btn-tiny"
                onClick={handleCopyMarkdown}
              >
                {copied ? 'COPIED!' : 'COPY MD'}
              </button>
            </div>
            <pre className="issue-preview-pre">{bodyText}</pre>
          </div>

          <div className="modal-actions-row">
            <button type="submit" className="retro-btn btn-primary">
              <span>LAUNCH GITHUB ISSUE ↗</span>
            </button>
            <button
              type="button"
              className="retro-btn btn-outline"
              onClick={() => {
                sfx.playBeep();
                onClose();
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
