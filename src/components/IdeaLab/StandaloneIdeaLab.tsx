import React, { useState } from 'react';
import type { IdeaItem } from '../../types';
import { IDEAS } from '../../utils/constants';

export interface StandaloneIdeaLabProps {
  ideas?: IdeaItem[];
  githubRepo?: string;
  theme?: 'dark' | 'retro' | 'cyber';
  onCollabClick?: (idea: IdeaItem) => void;
}

/**
 * Standalone Idea Lab Component
 * Can be imported into any React application:
 * `import { StandaloneIdeaLab } from '@clancydesilva/idea-lab'`
 */
export const StandaloneIdeaLab: React.FC<StandaloneIdeaLabProps> = ({
  ideas = IDEAS,
  githubRepo = 'clancydesilva/game-start',
  theme = 'retro',
  onCollabClick
}) => {
  const [items, setItems] = useState<IdeaItem[]>(ideas);
  const [resonated, setResonated] = useState<Record<string, boolean>>({});

  const handleResonance = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, resonances: it.resonances + 1 } : it))
    );
    setResonated((prev) => ({ ...prev, [id]: true }));
  };

  const handleCollab = (item: IdeaItem) => {
    if (onCollabClick) {
      onCollabClick(item);
    } else {
      const title = encodeURIComponent(`[COLLAB QUEST] ${item.title}`);
      const body = encodeURIComponent(
        `Hi! I would like to collaborate on **${item.title}**.\n\n### My proposal:\n[Write your notes here]`
      );
      window.open(
        `https://github.com/${githubRepo}/issues/new?title=${title}&body=${body}`,
        '_blank'
      );
    }
  };

  return (
    <div className={`standalone-idealab-root theme-${theme}`}>
      <div className="sil-header">
        <div className="sil-badge">OPEN SOURCE IDEA LAB WIDGET</div>
        <h3 className="sil-title">TUMBLING UNFINISHED IDEAS</h3>
        <p className="sil-sub">
          Resonate with work-in-progress experiments or open a GitHub Issue to co-build.
        </p>
      </div>

      <div className="sil-grid">
        {items.map((it) => (
          <div key={it.id} className="sil-card" style={{ borderLeftColor: it.color }}>
            <div className="sil-card-top">
              <span className="sil-tag" style={{ color: it.color }}>
                {it.type}-PIECE
              </span>
              <span className="sil-stage">{it.stage}</span>
            </div>
            <h4 className="sil-card-title">{it.title}</h4>
            <p className="sil-card-pitch">{it.pitch}</p>
            <div className="sil-tags">
              {it.tags.map((t, idx) => (
                <span key={idx} className="sil-chip">
                  #{t}
                </span>
              ))}
            </div>
            <div className="sil-card-actions">
              <button
                type="button"
                className={`sil-btn-res ${resonated[it.id] ? 'active' : ''}`}
                onClick={() => handleResonance(it.id)}
              >
                ♥ {it.resonances}
              </button>
              <button
                type="button"
                className="sil-btn-collab"
                onClick={() => handleCollab(it)}
              >
                COLLAB ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
