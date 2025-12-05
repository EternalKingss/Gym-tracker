import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components';
import { useAuth } from '../contexts/AuthContext';

type ViewMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

const Auth: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, resetPassword, updatePassword } = useAuth();

  // Check for password reset token in URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');

    if (type === 'recovery') {
      setViewMode('reset-password');
      showMessage('Enter your new password below', 'success');
    }
  }, []);

  const showMessage = (text: string, type: 'success' | 'error' | 'warning') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        showMessage('Login successful!', 'success');
      } else {
        if (result.attemptsLeft !== undefined && result.attemptsLeft > 0) {
          showMessage(
            `${result.message || 'Invalid credentials'}. ${result.attemptsLeft} attempts remaining.`,
            'warning'
          );
        } else {
          showMessage(result.message || 'Login failed', 'error');
        }
      }
    } catch (error) {
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showMessage('Please enter your name', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(email, password, name);

      if (success) {
        showMessage('Account created successfully!', 'success');
      } else {
        showMessage('Failed to create account. Email may already be registered.', 'error');
      }
    } catch (error) {
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showMessage('Please enter your email address', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        showMessage(result.message, 'success');
        // Go back to login after 3 seconds
        setTimeout(() => setViewMode('login'), 3000);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(password);

      if (result.success) {
        showMessage('Password updated successfully! Redirecting to login...', 'success');
        // Clear URL hash and go to login
        window.location.hash = '';
        setTimeout(() => setViewMode('login'), 2000);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (viewMode === 'login') {
      handleLogin(e);
    } else if (viewMode === 'signup') {
      handleSignup(e);
    } else if (viewMode === 'forgot-password') {
      handleForgotPassword(e);
    } else {
      handleUpdatePassword(e);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1a1410 0%, #2d1f0d 25%, #1f1610 50%, #0f0a05 100%)',
      }}
    >
      {/* Background glows - Golden/Amber theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 200, 87, 0.25) 0%, rgba(255, 179, 71, 0.1) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(249, 115, 22, 0.15) 40%, transparent 70%)',
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

        {/* Message Display */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 p-4 rounded-xl border-2 ${
                message.type === 'success'
                  ? 'bg-green-500/20 border-green-400 text-green-300'
                  : message.type === 'warning'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-red-500/20 border-red-400 text-red-300'
              }`}
            >
              <p className="text-sm font-semibold">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <GlassCard>
          <div className="space-y-6">
            {/* Tab Selector - Only show for login/signup */}
            {viewMode !== 'forgot-password' && viewMode !== 'reset-password' && (
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode('login')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    viewMode === 'login'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-amber-950/40 text-amber-200/60 border-2 border-amber-500/20 hover:border-amber-400/40'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setViewMode('signup')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    viewMode === 'signup'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-amber-950/40 text-amber-200/60 border-2 border-amber-500/20 hover:border-amber-400/40'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Back button for forgot password */}
            {viewMode === 'forgot-password' && (
              <button
                onClick={() => setViewMode('login')}
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>←</span>
                <span>Back to Login</span>
              </button>
            )}

            {/* Form Title */}
            <div className="text-center">
              <h3 className="text-white text-xl font-bold">
                {viewMode === 'login' && 'Welcome Back'}
                {viewMode === 'signup' && 'Create Account'}
                {viewMode === 'forgot-password' && 'Reset Password'}
                {viewMode === 'reset-password' && 'Set New Password'}
              </h3>
              {viewMode === 'forgot-password' && (
                <p className="text-white/60 text-sm mt-2">
                  Enter your email and we'll send you a password reset link
                </p>
              )}
              {viewMode === 'reset-password' && (
                <p className="text-white/60 text-sm mt-2">
                  Choose a strong password for your account
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {viewMode === 'signup' && (
                <div>
                  <label className="text-white/80 text-sm block mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              {viewMode !== 'reset-password' && (
                <div>
                  <label className="text-white/80 text-sm block mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              )}

              {viewMode !== 'forgot-password' && (
                <>
                  <div>
                    <label className="text-white/80 text-sm block mb-2">
                      {viewMode === 'reset-password' ? 'New Password' : 'Password'}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                    {(viewMode === 'signup' || viewMode === 'reset-password') && (
                      <p className="text-white/50 text-xs mt-1">Minimum 6 characters</p>
                    )}
                  </div>

                  {viewMode === 'reset-password' && (
                    <div>
                      <label className="text-white/80 text-sm block mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-amber-950/30 border-2 border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all"
                        placeholder="••••••••"
                        minLength={6}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : (
                  <>
                    {viewMode === 'login' && 'Login'}
                    {viewMode === 'signup' && 'Create Account'}
                    {viewMode === 'forgot-password' && 'Send Reset Link'}
                    {viewMode === 'reset-password' && 'Update Password'}
                  </>
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            {viewMode === 'login' && (
              <div className="text-center">
                <button
                  onClick={() => setViewMode('forgot-password')}
                  className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Toggle between login/signup */}
            {viewMode !== 'forgot-password' && (
              <div className="text-center text-sm text-white/60">
                {viewMode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setViewMode('signup')}
                      className="text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      onClick={() => setViewMode('login')}
                      className="text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        <div className="text-center text-white/40 text-xs mt-6 space-y-1">
          <p>🔒 Your data is securely encrypted</p>
          <p>Account locked after 5 failed login attempts</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
