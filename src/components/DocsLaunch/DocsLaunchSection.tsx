import React, { useState } from 'react';
import { StandaloneIdeaLab } from '../IdeaLab/StandaloneIdeaLab';
import { sfx } from '../../utils/sfx';

export const DocsLaunchSection: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [upvotes, setUpvotes] = useState<number>(428);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);

  const handleCopy = (key: string, text: string) => {
    sfx.playBeep();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUpvote = () => {
    if (!hasUpvoted) {
      sfx.playResonance();
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const npmSnippet = `npm install @clancydesilva/idea-lab`;
  const reactSnippet = `import { StandaloneIdeaLab } from '@clancydesilva/idea-lab';
import '@clancydesilva/idea-lab/dist/index.css';

export function MyPortfolio() {
  return (
    <StandaloneIdeaLab
      githubRepo="clancydesilva/game-start"
      theme="retro"
    />
  );
}`;

  const webComponentSnippet = `<!-- HTML Web Component (Works in any framework) -->
<script type="module" src="https://unpkg.com/@clancydesilva/idea-lab/dist/web-component.js"></script>

<idea-lab-widget repo="clancydesilva/game-start"></idea-lab-widget>`;

  return (
    <section className="docs-launch-section" id="docs-launch">
      <div className="arcade-cabinet-header">
        <div className="arcade-title-box">
          <span className="arcade-sub">STAGE 03 // OPEN SOURCE RELEASE</span>
          <h2 className="arcade-main-title">
            <span className="title-docs">NPM</span> & PRODUCT HUNT LAUNCH
          </h2>
          <p className="arcade-instruction">
            STANDALONE EMBEDDABLE COMPONENT • PUBLISHED TO NPM & LIVE ON PRODUCT HUNT
          </p>
        </div>
      </div>

      {/* Product Hunt Launch Banner */}
      <div className="ph-launch-card">
        <div className="ph-left">
          <div className="ph-cat-badge">😸 PRODUCT HUNT // LAUNCH DAY</div>
          <h3 className="ph-title">Idea Lab for Dev Portfolios</h3>
          <p className="ph-tagline">
            Turn loose unfinished ideas into interactive tumbling Tetris blocks. Collect no-login resonance votes and pre-filled GitHub collab issues.
          </p>
          <div className="ph-badges">
            <span className="ph-rank-badge">🏆 #1 PRODUCT OF THE DAY</span>
            <span className="ph-pill">FEATURED IN DEV TOOLS</span>
            <span className="ph-pill">100% OPEN SOURCE</span>
          </div>
        </div>

        <div className="ph-right">
          <button
            type="button"
            className={`ph-upvote-btn ${hasUpvoted ? 'voted' : ''}`}
            onClick={handleUpvote}
          >
            <span className="ph-triangle">▲</span>
            <span className="ph-vote-text">{hasUpvoted ? 'UPVOTED' : 'UPVOTE'}</span>
            <span className="ph-vote-count">{upvotes}</span>
          </button>
        </div>
      </div>

      {/* Docs Grid */}
      <div className="docs-layout-grid">
        <div className="docs-code-column">
          {/* Quick Install */}
          <div className="docs-card">
            <div className="docs-card-header">
              <span className="docs-card-title">01 // PACKAGE INSTALLATION</span>
              <button
                className="btn-tiny"
                onClick={() => handleCopy('npm', npmSnippet)}
              >
                {copiedKey === 'npm' ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <pre className="docs-code-block">
              <code>{npmSnippet}</code>
            </pre>
          </div>

          {/* React Usage */}
          <div className="docs-card">
            <div className="docs-card-header">
              <span className="docs-card-title">02 // REACT COMPONENT USAGE</span>
              <button
                className="btn-tiny"
                onClick={() => handleCopy('react', reactSnippet)}
              >
                {copiedKey === 'react' ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <pre className="docs-code-block">
              <code>{reactSnippet}</code>
            </pre>
          </div>

          {/* Web Component Usage */}
          <div className="docs-card">
            <div className="docs-card-header">
              <span className="docs-card-title">03 // VANILLA HTML WEB COMPONENT</span>
              <button
                className="btn-tiny"
                onClick={() => handleCopy('wc', webComponentSnippet)}
              >
                {copiedKey === 'wc' ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <pre className="docs-code-block">
              <code>{webComponentSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Live Interactive Sandbox Preview */}
        <div className="docs-preview-column">
          <div className="preview-container-box">
            <div className="preview-top-bar">
              <span className="preview-beacon">● LIVE EMBED SANDBOX PREVIEW ●</span>
            </div>
            <div className="preview-widget-mount">
              <StandaloneIdeaLab />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
