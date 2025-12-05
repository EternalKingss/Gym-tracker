import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { workoutService } from '../services/workoutService';
import { loginAttemptService } from '../services/loginAttemptService';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; attemptsLeft?: number }>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      // Try Supabase first
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            // Fetch user profile from database
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              const userData: User = {
                id: profile.id,
                email: profile.email,
                name: profile.username,
                username: profile.username,
                createdAt: profile.created_at,
              };
              setUser(userData);
              localStorage.setItem('currentUser', JSON.stringify(userData));

              // Import user data from backend
              await workoutService.importFromBackend(userData.id);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error checking Supabase auth:', error);
        }
      }

      // Fallback to localStorage
      const savedUser = localStorage.getItem('currentUser');
      console.log('Checking for saved user:', savedUser);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log('Signup attempt for:', email);

      // Try Supabase first
      if (supabase) {
        try {
          // Sign up with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) {
            console.error('Supabase signup error:', authError);
            alert(authError.message);
            return false;
          }

          if (authData.user) {
            // Create user profile in database
            const { error: profileError } = await supabase.from('users').insert({
              id: authData.user.id,
              username: name,
              email: email,
            });

            if (profileError) {
              console.error('Profile creation error:', profileError);
              alert('Failed to create user profile');
              return false;
            }

            // Create initial progression record
            const { error: progressionError } = await supabase.from('user_progression').insert({
              user_id: authData.user.id,
              current_week: 1,
              completed_days: [],
            });

            if (progressionError) {
              console.error('Progression creation error:', progressionError);
            }

            const userData: User = {
              id: authData.user.id,
              email: email,
              name: name,
              username: name,
              createdAt: new Date().toISOString(),
            };

            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('Supabase signup successful!', userData);

            return true;
          }
        } catch (error) {
          console.error('Supabase signup error:', error);
          // Continue to localStorage fallback
        }
      }

      // Fallback to localStorage
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      console.log('Existing users:', users);

      // Check if email already exists
      if (users.find((u: any) => u.email === email)) {
        alert('Email already registered!');
        return false;
      }

      // Create new user
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email,
        name,
        username: name,
        password, // In production, hash this!
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('User saved! Total users:', users.length);

      // Set as current user (without password)
      const userWithoutPassword: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        createdAt: newUser.createdAt,
      };

      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      console.log('Signup successful! Current user:', userWithoutPassword);

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed! Check console for details.');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; attemptsLeft?: number }> => {
    try {
      console.log('Login attempt for:', email);

      // Check if account is locked
      if (loginAttemptService.isAccountLocked(email)) {
        const lockTime = loginAttemptService.getRemainingLockTime(email);
        return {
          success: false,
          message: `Account locked due to too many failed login attempts. Please try again in ${lockTime} minutes or reset your password.`,
        };
      }

      // Try Supabase first
      if (supabase) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) {
            console.error('Supabase login error:', authError);

            // Record failed attempt
            const result = loginAttemptService.recordFailedAttempt(email);

            if (result.locked) {
              return {
                success: false,
                message: `Too many failed attempts. Your account has been locked for ${result.lockTimeMinutes} minutes. A password reset email will be sent to you.`,
              };
            }

            return {
              success: false,
              message: authError.message,
              attemptsLeft: result.attemptsLeft,
            };
          }

          if (authData.user) {
            // Fetch user profile from database
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', authData.user.id)
              .single();

            if (profileError || !profile) {
              console.error('Profile fetch error:', profileError);
              return {
                success: false,
                message: 'Failed to fetch user profile',
              };
            }

            const userData: User = {
              id: profile.id,
              email: profile.email,
              name: profile.username,
              username: profile.username,
              createdAt: profile.created_at,
            };

            // Clear login attempts on successful login
            loginAttemptService.recordSuccessfulLogin(email);

            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Import user data from backend
            await workoutService.importFromBackend(userData.id);

            console.log('Supabase login successful!', userData);
            return { success: true };
          }
        } catch (error) {
          console.error('Supabase login error:', error);
          // Continue to localStorage fallback
        }
      }

      // Fallback to localStorage
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        // Record failed attempt
        const result = loginAttemptService.recordFailedAttempt(email);

        if (result.locked) {
          return {
            success: false,
            message: `Too many failed attempts. Your account has been locked for ${result.lockTimeMinutes} minutes. Please reset your password.`,
          };
        }

        return {
          success: false,
          message: `Invalid email or password. ${result.attemptsLeft} attempts remaining.`,
          attemptsLeft: result.attemptsLeft,
        };
      }

      // Clear login attempts on successful login
      loginAttemptService.recordSuccessfulLogin(email);

      // Set as current user (without password)
      const userWithoutPassword: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        username: foundUser.username || foundUser.name,
        createdAt: foundUser.createdAt,
      };

      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      console.log('Login successful!', userWithoutPassword);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed! Please try again.',
      };
    }
  };

  const logout = async () => {
    console.log('Logging out user:', user?.email);

    // Sign out from Supabase if available
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Supabase logout error:', error);
      }
    }

    setUser(null);
    localStorage.removeItem('currentUser');
    console.log('Logout complete');
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Password reset request for:', email);

      // Try Supabase first
      if (supabase) {
        try {
          // Check if user exists first
          const usersJson = localStorage.getItem('users');
          const users = usersJson ? JSON.parse(usersJson) : [];
          const userExists = users.find((u: any) => u.email === email);

          if (!userExists) {
            // For security, don't reveal if email exists or not
            return {
              success: true,
              message: 'If an account with that email exists, a password reset link has been sent.',
            };
          }

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (error) {
            console.error('Supabase password reset error:', error);
            return {
              success: false,
              message: error.message,
            };
          }

          // Unlock the account
          loginAttemptService.unlockAccount(email);

          return {
            success: true,
            message: 'Password reset link has been sent to your email. Please check your inbox.',
          };
        } catch (error) {
          console.error('Supabase password reset error:', error);
          // Continue to localStorage fallback
        }
      }

      // Fallback to localStorage
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      const userExists = users.find((u: any) => u.email === email);

      if (!userExists) {
        // For security, don't reveal if email exists or not
        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent to your email.',
        };
      }

      // Unlock the account
      loginAttemptService.unlockAccount(email);

      // In offline mode, store reset token
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
      resetTokens[resetToken] = {
        email,
        expires: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      };
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));

      // In a real app, this would send an email
      console.log('Password reset link (offline mode):', `${window.location.origin}/reset-password?token=${resetToken}`);

      return {
        success: true,
        message: 'Password reset instructions have been sent. (In offline mode, check console for reset link)',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.',
      };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Try Supabase first
      if (supabase && user) {
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            console.error('Supabase password update error:', error);
            return {
              success: false,
              message: error.message,
            };
          }

          return {
            success: true,
            message: 'Password updated successfully!',
          };
        } catch (error) {
          console.error('Supabase password update error:', error);
          // Continue to localStorage fallback
        }
      }

      // Fallback to localStorage
      if (!user) {
        return {
          success: false,
          message: 'You must be logged in to change your password.',
        };
      }

      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      const userIndex = users.findIndex((u: any) => u.id === user.id);

      if (userIndex === -1) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));

      return {
        success: true,
        message: 'Password updated successfully!',
      };
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        message: 'Failed to update password. Please try again.',
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, updatePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
