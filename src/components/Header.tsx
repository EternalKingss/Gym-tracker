import React from 'react'
import { motion } from 'framer-motion'

interface HeaderProps {
  title?: string
  subtitle?: string
  className?: string
}

/**
 * Header - Main application header
 *
 * Features:
 * - Glassmorphic design
 * - Smooth animations
 * - Responsive layout
 * - Dark theme optimized
 */
const Header: React.FC<HeaderProps> = ({
  title = 'Gym Tracker',
  subtitle = 'Track your fitness journey',
  className = '',
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        glass-dark-lg
        border-b border-white/10
        sticky top-0 z-50
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-gradient text-4xl font-bold mb-2">{title}</h1>
          <p className="text-gray-400">{subtitle}</p>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Header
