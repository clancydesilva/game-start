import React from 'react';
import { SKILLS_LIST } from '../utils/constants';

export const SkillsTicker: React.FC = () => {
  // Duplicate for seamless infinite loop
  const tickerItems = [...SKILLS_LIST, ...SKILLS_LIST, ...SKILLS_LIST];

  return (
    <div className="skills-ticker-wrapper" aria-label="Skills Marquee">
      <div className="ticker-label">
        <span className="blink-text">▶</span> SKILLS
      </div>
      <div className="ticker-track">
        <div className="ticker-content">
          {tickerItems.map((skill, idx) => (
            <span key={idx} className="ticker-item">
              <span className="ticker-star">★</span>
              <span className="ticker-text">{skill}</span>
              <span className="ticker-coin">🪙</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
