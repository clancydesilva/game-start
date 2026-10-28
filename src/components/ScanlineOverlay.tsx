import React from 'react';

interface ScanlineOverlayProps {
  enabled: boolean;
}

export const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <div className="crt-overlay-container" aria-hidden="true">
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="crt-flicker" />
    </div>
  );
};
