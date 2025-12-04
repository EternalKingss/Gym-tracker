import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * GlassCard - A reusable glassmorphic card component
 *
 * Features:
 * - Backdrop blur effect for glassmorphism
 * - Semi-transparent dark background
 * - Subtle borders
 * - Highly rounded corners
 * - Soft shadows
 */
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-md
        bg-black/20
        border
        border-white/10
        rounded-3xl
        shadow-lg
        shadow-black/20
        p-6
        transition-all
        duration-300
        hover:bg-black/30
        hover:border-white/20
        hover:shadow-xl
        hover:shadow-black/30
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
