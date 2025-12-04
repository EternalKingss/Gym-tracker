import React from 'react'
import { motion } from 'framer-motion'

interface FooterProps {
  className?: string
}

/**
 * Footer - Application footer
 *
 * Features:
 * - Glassmorphic design
 * - Copyright information
 * - Quick links
 */
const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`
        glass-dark
        border-t border-white/10
        mt-12
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-purple-400 font-semibold mb-4">About</h3>
            <p className="text-gray-400 text-sm">
              Track your fitness journey with our modern, intuitive gym tracker application.
            </p>
          </div>
          <div>
            <h3 className="text-purple-400 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Workouts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Settings
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-purple-400 font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">support@gymtracker.app</p>
          </div>
        </div>

        <motion.div
          className="border-t border-white/10 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-center text-gray-500 text-sm">
            Copyright {currentYear} Gym Tracker. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
