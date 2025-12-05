import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * GlassCard - A reusable glassmorphic card component with golden/amber aesthetic
 *
 * Features:
 * - Backdrop blur effect for glassmorphism
 * - Semi-transparent warm background
 * - Golden/amber borders with glow
 * - Highly rounded corners
 * - Luxurious golden shadows
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
        backdrop-blur-xl
        bg-gradient-to-br from-amber-950/40 via-black/30 to-orange-950/40
        border-2
        border-amber-500/30
        rounded-3xl
        p-6
        transition-all
        duration-300
        hover:border-amber-400/50
        hover:shadow-2xl
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: '0 8px 32px rgba(217, 119, 6, 0.15), 0 0 0 1px rgba(251, 191, 36, 0.1), inset 0 1px 0 rgba(251, 191, 36, 0.2)',
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
