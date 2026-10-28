import React, { useState } from 'react';
import type { LeaderboardEntry } from '../../types';
import { INITIAL_LEADERBOARD } from '../../utils/constants';
import { sfx } from '../../utils/sfx';

interface LeaderboardSectionProps {
  currentScore: number;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ currentScore }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [initials, setInitials] = useState(['C', 'H', 'P']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('');

  const cycleLetter = (index: number, delta: number) => {
    sfx.playRotate();
    setInitials((prev) => {
      const next = [...prev];
      const curIdx = alphabet.indexOf(next[index]);
      const nextIdx = (curIdx + delta + alphabet.length) % alphabet.length;
      next[index] = alphabet[nextIdx];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playCoin();

    const userScore = Math.max(currentScore, 520000);
    const userInitials = initials.join('');

    const newEntry: LeaderboardEntry = {
      rank: 1, // temporary, will sort
      initials: userInitials,
      score: userScore,
      name: name || `Challenger ${userInitials}`,
      role: message.slice(0, 24) || 'Challenger Entry',
      date: 'TODAY',
      contactUrl: `mailto:clancydesilva@example.com?subject=Contact from ${userInitials}&body=${encodeURIComponent(
        `From: ${name} (${email})\n\nMessage:\n${message}`
      )}`
    };

    const combined = [...entries, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    setEntries(combined);
    setSubmitted(true);
  };

  return (
    <section className="leaderboard-section" id="leaderboard">
      <div className="arcade-cabinet-header">
        <div className="arcade-title-box">
          <span className="arcade-sub">STAGE 04 // HALL OF FAME</span>
          <h2 className="arcade-main-title">
            <span className="title-lead">LEADERBOARD</span> CONTACT
          </h2>
          <p className="arcade-instruction">
            ENTER YOUR 3-LETTER INITIALS TO REGISTER ON THE HIGH SCORE TABLE
          </p>
        </div>
      </div>

      <div className="leaderboard-grid-layout">
        {/* The High Score Table */}
        <div className="arcade-scores-table-box">
          <div className="table-top-marquee">
            <span>★ TOP ARCHITECTS & CHALLENGERS ★</span>
          </div>

          <table className="retro-scores-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>INIT</th>
                <th>SCORE</th>
                <th>PILOT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((item) => (
                <tr
                  key={item.rank}
                  className={`score-row rank-${item.rank} ${
                    item.initials === initials.join('') && submitted ? 'user-entry' : ''
                  }`}
                >
                  <td className="cell-rank">
                    {item.rank === 1 ? '🥇 1ST' : item.rank === 2 ? '🥈 2ND' : item.rank === 3 ? '🥉 3RD' : `${item.rank}TH`}
                  </td>
                  <td className="cell-init">{item.initials}</td>
                  <td className="cell-score">{item.score.toLocaleString()}</td>
                  <td className="cell-name">{item.name}</td>
                  <td className="cell-role">
                    <span className="role-tag">{item.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-bottom-bar">
            <span>CLANCY DESILVA // LEVEL 99 ARCHITECT</span>
            <a href="mailto:clancydesilva@example.com" className="direct-email-link" onClick={() => sfx.playCoin()}>
              EMAIL DIRECT ↗
            </a>
          </div>
        </div>

        {/* 3-Letter Initials Interactive Submission Terminal */}
        <div className="initials-terminal-box">
          <div className="terminal-header">
            <span className="terminal-title">ENTER INITIALS & QUEST</span>
            <span className="terminal-dot" />
          </div>

          {submitted ? (
            <div className="terminal-success-state">
              <div className="success-icon">🏆</div>
              <h3 className="success-title">SCORE REGISTERED!</h3>
              <p className="success-desc">
                Welcome to the Hall of Fame, <strong>{initials.join('')}</strong>! Your message is ready to send.
              </p>
              <div className="success-actions">
                <a
                  href={`mailto:clancydesilva@example.com?subject=Arcade Contact from ${initials.join('')}&body=${encodeURIComponent(
                    `From: ${name} (${email})\nScore: ${currentScore}\n\nMessage:\n${message}`
                  )}`}
                  className="retro-btn btn-primary"
                  onClick={() => sfx.playCoin()}
                >
                  DISPATCH EMAIL 🚀
                </a>
                <button
                  type="button"
                  className="retro-btn btn-outline"
                  onClick={() => setSubmitted(false)}
                >
                  NEW CHALLENGER
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="terminal-form">
              {/* Arcade Initials Selector */}
              <div className="initials-selector-group">
                <span className="selector-title">CHOOSE 3-LETTER INITIALS:</span>
                <div className="slots-container">
                  {initials.map((char, slotIdx) => (
                    <div key={slotIdx} className="slot-wheel">
                      <button
                        type="button"
                        className="slot-arrow"
                        onClick={() => cycleLetter(slotIdx, -1)}
                      >
                        ▲
                      </button>
                      <div className="slot-digit">{char}</div>
                      <button
                        type="button"
                        className="slot-arrow"
                        onClick={() => cycleLetter(slotIdx, 1)}
                      >
                        ▼
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="terminal-field">
                <label className="retro-label" htmlFor="user-name">
                  YOUR CODENAME / NAME:
                </label>
                <input
                  id="user-name"
                  type="text"
                  className="retro-input"
                  placeholder="e.g. Clancy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="terminal-field">
                <label className="retro-label" htmlFor="user-email">
                  YOUR EMAIL ADDRESS:
                </label>
                <input
                  id="user-email"
                  type="email"
                  className="retro-input"
                  placeholder="pilot@arcade.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="terminal-field">
                <label className="retro-label" htmlFor="user-msg">
                  MESSAGE / CONTRACT / QUEST:
                </label>
                <textarea
                  id="user-msg"
                  className="retro-textarea"
                  rows={3}
                  placeholder="Let's build something epic together..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="retro-btn btn-primary btn-block">
                <span>INSERT INITIALS & SUBMIT 🪙</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
