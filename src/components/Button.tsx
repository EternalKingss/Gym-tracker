import React from 'react'
import { motion } from 'framer-motion'
import type { ButtonProps } from '../types'

/**
 * Button - Modern glassmorphic button component
 *
 * Features:
 * - Multiple variants (primary, secondary, accent, danger)
 * - Multiple sizes (small, medium, large)
 * - Smooth animations with Framer Motion
 * - Glassmorphic styling with backdrop blur
 * - Icon support
 * - Loading state with spinner
 * - Dark theme optimized
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/30 border border-amber-400/30',
    secondary: 'bg-amber-950/40 hover:bg-amber-950/60 text-amber-200 border-2 border-amber-500/30 hover:border-amber-400/50',
    accent: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/40',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg',
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const baseClasses = 'btn-base transition-all duration-300 ease-in-out flex items-center justify-center gap-2'
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
      `}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {loading ? (
        <span className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}

export default Button
