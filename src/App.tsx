import { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import GymTracker from './pages/GymTracker';
import Progress from './pages/Progress';
import Program from './pages/Program';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

function AppContent() {
  const { user, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'workout' | 'progress' | 'program' | 'settings'>('program');
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">💪 Gym Tracker</h1>

          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage('program')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  currentPage === 'program'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                }`}
              >
                Program
              </button>
              <button
                onClick={() => setCurrentPage('workout')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  currentPage === 'workout'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                }`}
              >
                Workout
              </button>
              <button
                onClick={() => setCurrentPage('progress')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  currentPage === 'progress'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                }`}
              >
                Progress
              </button>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-sm font-medium hidden md:block">{user.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-white/60 text-sm">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPage('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-white/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="pt-20">
        {currentPage === 'program' ? (
          <Program />
        ) : currentPage === 'workout' ? (
          <GymTracker />
        ) : currentPage === 'progress' ? (
          <Progress />
        ) : (
          <Settings />
        )}
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
