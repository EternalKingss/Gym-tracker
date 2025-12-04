import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      await login(email, password);
    } else {
      if (!name.trim()) {
        alert('Please enter your name');
        return;
      }
      await signup(email, password, name);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom right, #4a5568 0%, #2d3748 30%, #1a202c 70%, #000000 100%)',
      }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0) 70%)',
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(251, 146, 60, 0) 70%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="text-center mb-8">
          <h1 className="text-white text-5xl font-bold mb-2">💪</h1>
          <h2 className="text-white text-3xl font-bold">Gym Tracker</h2>
          <p className="text-white/60 mt-2">Track your fitness journey</p>
        </div>

        <GlassCard>
          <div className="space-y-6">
            {/* Tab Selector */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  isLogin
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  !isLogin
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-white/80 text-sm block mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 transition-colors"
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="text-white/80 text-sm block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="text-white/80 text-sm block mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>

            <div className="text-center text-sm text-white/60">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </GlassCard>

        <p className="text-center text-white/40 text-xs mt-6">
          Your data is stored locally in your browser
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
