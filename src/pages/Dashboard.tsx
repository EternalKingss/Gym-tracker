import React from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import StatCard from '../components/StatCard'
import Button from '../components/Button'

/**
 * Dashboard Page - Main application page
 *
 * Features:
 * - Display key fitness statistics
 * - Quick action buttons
 * - Responsive grid layout
 * - Glassmorphic cards
 */
const Dashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  // Mock data
  const stats = [
    {
      title: 'Total Workouts',
      value: 24,
      unit: 'sessions',
      trend: { value: 15, direction: 'up' as const },
      description: 'This month',
    },
    {
      title: 'Calories Burned',
      value: '2,450',
      unit: 'kcal',
      trend: { value: 8, direction: 'up' as const },
      description: 'This week',
    },
    {
      title: 'Total Duration',
      value: '42',
      unit: 'hours',
      trend: { value: 12, direction: 'up' as const },
      description: 'This month',
    },
    {
      title: 'Current Streak',
      value: 7,
      unit: 'days',
      trend: { value: 100, direction: 'stable' as const },
      description: 'Keep it up!',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <Header
        title="Gym Tracker"
        subtitle="Welcome back! Track your fitness journey"
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="medium">
              Start Workout
            </Button>
            <Button variant="secondary" size="medium">
              View History
            </Button>
            <Button variant="secondary" size="medium">
              Set Goals
            </Button>
            <Button variant="secondary" size="medium">
              Settings
            </Button>
          </div>
        </motion.section>

        {/* Statistics Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  unit={stat.unit}
                  trend={stat.trend}
                  description={stat.description}
                  variant="primary"
                  size="medium"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="glass-dark-lg p-8 space-y-4">
            <p className="text-gray-400">
              Your recent workouts and activities will appear here once you start logging.
            </p>
            <Button variant="primary" size="medium">
              Log Your First Workout
            </Button>
          </div>
        </motion.section>

        {/* Motivational Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12"
        >
          <div className="glass-dark-lg p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-2">Stay Motivated!</h3>
            <p className="text-gray-300">
              Consistency is key. Keep working towards your fitness goals one workout at a time.
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
