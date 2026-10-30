import React, { useState, useEffect } from 'react';
import type { IdeaItem } from '../../types';
import { IDEAS } from '../../utils/constants';
import { TumblingCanvas } from './TumblingCanvas';
import { CollabModal } from './CollabModal';
import { sfx } from '../../utils/sfx';

interface IdeaLabSectionProps {
  onOpenDocs?: () => void;
}

export const IdeaLabSection: React.FC<IdeaLabSectionProps> = ({ onOpenDocs }) => {
  const [ideas, setIdeas] = useState<IdeaItem[]>(IDEAS);
  const [selectedIdea, setSelectedIdea] = useState<IdeaItem | null>(null);
  const [activeCollabIdea, setActiveCollabIdea] = useState<IdeaItem | null>(null);
  const [resonantIds, setResonantIds] = useState<Record<string, boolean>>({});

  // Load stored resonances from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('arcade_idea_resonances');
      if (stored) {
        const parsed: Record<string, number> = JSON.parse(stored);
        setIdeas((prev) =>
          prev.map((item) => ({
            ...item,
            resonances: item.resonances + (parsed[item.id] || 0)
          }))
        );
        const resonatedMap: Record<string, boolean> = {};
        Object.keys(parsed).forEach((k) => {
          if (parsed[k] > 0) resonatedMap[k] = true;
        });
        setResonantIds(resonatedMap);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleResonance = (idea: IdeaItem) => {
    sfx.playResonance();

    setIdeas((prev) =>
      prev.map((item) => {
        if (item.id === idea.id) {
          const nextCount = item.resonances + 1;
          return { ...item, resonances: nextCount };
        }
        return item;
      })
    );

    setResonantIds((prev) => ({ ...prev, [idea.id]: true }));

    // Persist to localStorage
    try {
      const stored = localStorage.getItem('arcade_idea_resonances');
      const parsed: Record<string, number> = stored ? JSON.parse(stored) : {};
      parsed[idea.id] = (parsed[idea.id] || 0) + 1;
      localStorage.setItem('arcade_idea_resonances', JSON.stringify(parsed));
    } catch {
      // ignore
    }
  };

  return (
    <section className="idea-lab-section" id="idea-lab">
      <div className="arcade-cabinet-header">
        <div className="arcade-title-box">
          <span className="arcade-sub">STAGE 02 // RESEARCH & EXPERIMENTS</span>
          <h2 className="arcade-main-title">
            <span className="title-lab">IDEA</span> LAB
          </h2>
          <p className="arcade-instruction">
            LOOSE TUMBLING TETRIS PIECES = UNFINISHED IDEAS • RESONATE OR CO-BUILD
          </p>
        </div>

        <div className="idea-lab-actions">
          <button
            className="retro-btn btn-sm btn-outline"
            onClick={() => onOpenDocs?.()}
          >
            [&gt;] EMBED WIDGET &amp; DOCS
          </button>
        </div>
      </div>

      {/* Physics Tumbling Canvas */}
      <TumblingCanvas
        ideas={ideas}
        onSelectIdea={(idea) => setSelectedIdea(idea)}
        selectedIdeaId={selectedIdea?.id || null}
      />

      {/* Idea Cards Grid */}
      <div className="ideas-matrix-grid">
        {ideas.map((idea) => {
          const isSelected = selectedIdea?.id === idea.id;
          const hasResonated = resonantIds[idea.id];

          return (
            <div
              key={idea.id}
              className={`idea-card ${isSelected ? 'idea-card-selected' : ''}`}
              style={{ borderTopColor: idea.color }}
              onClick={() => setSelectedIdea(idea)}
            >
              <div className="idea-card-header">
                <div className="idea-type-badge" style={{ backgroundColor: idea.color }}>
                  <span>{idea.type}-PIECE</span>
                </div>
                <span className="idea-stage-pill">{idea.stage}</span>
              </div>

              <h3 className="idea-title" style={{ color: idea.color }}>
                {idea.title}
              </h3>

              <p className="idea-pitch-text">{idea.pitch}</p>

              <div className="idea-tags-row">
                {idea.tags.map((tag, idx) => (
                  <span key={idx} className="idea-tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="idea-card-footer">
                <button
                  type="button"
                  className={`retro-btn-resonance ${hasResonated ? 'is-resonated' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResonance(idea);
                  }}
                  title="Resonate (No login required)"
                >
                  <span className="resonance-heart">♥</span>
                  <span className="resonance-count">{idea.resonances}</span>
                  <span className="resonance-label">RESONATE</span>
                </button>

                <button
                  type="button"
                  className="retro-btn btn-xs btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    sfx.playRotate();
                    setActiveCollabIdea(idea);
                  }}
                >
                  <span>COLLAB ↗</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collab Request Modal */}
      <CollabModal
        idea={activeCollabIdea}
        onClose={() => setActiveCollabIdea(null)}
      />
    </section>
  );
};
