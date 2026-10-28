/**
 * IdeaLabWebComponent
 * Embeddable Web Component for vanilla HTML, Next.js, Astro, or Vue.
 * Usage:
 * <script type="module" src="https://unpkg.com/@clancydesilva/idea-lab/dist/web-component.js"></script>
 * <idea-lab-widget repo="clancydesilva/game-start"></idea-lab-widget>
 */

export class IdeaLabWidgetElement extends HTMLElement {
  connectedCallback() {
    const repo = this.getAttribute('repo') || 'clancydesilva/game-start';

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Press Start 2P', monospace, sans-serif;
          background: #0f1015;
          color: #f0f0f0;
          border: 4px solid #aa3bff;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 8px 24px rgba(170, 59, 255, 0.25);
        }
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px dashed #aa3bff;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .widget-title {
          font-size: 14px;
          color: #00f0f0;
          margin: 0;
        }
        .widget-badge {
          font-size: 9px;
          background: #aa3bff;
          color: #fff;
          padding: 4px 8px;
        }
        .widget-desc {
          font-size: 10px;
          line-height: 1.6;
          color: #999;
          margin-bottom: 16px;
        }
        .widget-btn {
          font-family: inherit;
          font-size: 10px;
          padding: 8px 12px;
          background: #00f0f0;
          color: #000;
          border: 2px solid #000;
          cursor: pointer;
        }
        .widget-btn:hover {
          background: #fff;
        }
      </style>
      <div class="widget-root">
        <div class="widget-header">
          <h3 class="widget-title">★ IDEA LAB EMBED</h3>
          <span class="widget-badge">OPEN SOURCE</span>
        </div>
        <p class="widget-desc">
          Connected to GitHub Repo: <strong>${repo}</strong>.
          Loose tumbling ideas & open-source collaboration engine ready for npm.
        </p>
        <button class="widget-btn" id="explore-btn">VIEW IDEAS ON GITHUB ↗</button>
      </div>
    `;

    const btn = shadow.querySelector('#explore-btn');
    btn?.addEventListener('click', () => {
      window.open(`https://github.com/${repo}/issues`, '_blank');
    });
  }
}

if (typeof window !== 'undefined' && !customElements.get('idea-lab-widget')) {
  customElements.define('idea-lab-widget', IdeaLabWidgetElement);
}
