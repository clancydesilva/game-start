import React from 'react';

interface TetrisBlockProps {
  color: string;
  size?: number | string;
  isGhost?: boolean;
  isSolved?: boolean;
  className?: string;
  label?: string;
  onClick?: () => void;
}

export const TetrisBlock: React.FC<TetrisBlockProps> = ({
  color,
  size = 48,
  isGhost = false,
  isSolved = false,
  className = '',
  label,
  onClick
}) => {
  const style: React.CSSProperties = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    backgroundColor: isGhost ? 'transparent' : color,
    borderColor: isGhost ? color : '#000000',
    opacity: isGhost ? 0.4 : 1
  };

  return (
    <div
      className={`tetris-pixel-block ${isGhost ? 'is-ghost' : ''} ${isSolved ? 'is-solved' : ''} ${className}`}
      style={style}
      onClick={onClick}
      title={label}
    >
      <div className="block-bevel-highlight" />
      <div className="block-bevel-shadow" />
      <div className="block-inner-core" />
      {label && <span className="block-label">{label}</span>}
    </div>
  );
};
