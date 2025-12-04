import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
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
    const savedUser = localStorage.getItem('currentUser');
    console.log('Checking for saved user:', savedUser);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log('Signup attempt for:', email);

      // Get existing users
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
        password, // In production, hash this!
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('User saved! Total users:', users.length);
      console.log('Saved users:', JSON.stringify(users, null, 2));

      // Set as current user (without password)
      const userWithoutPassword: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt for:', email);

      // Get existing users
      const usersJson = localStorage.getItem('users');
      console.log('Raw users JSON:', usersJson);

      const users = usersJson ? JSON.parse(usersJson) : [];
      console.log('Parsed users:', users);
      console.log('Total users in database:', users.length);

      // Debug: Show all emails in database
      console.log('Emails in database:', users.map((u: any) => u.email));

      // Find user
      const foundUser = users.find(
        (u: any) => {
          console.log(`Comparing: "${u.email}" === "${email}" && "${u.password}" === "${password}"`);
          return u.email === email && u.password === password;
        }
      );

      console.log('Found user:', foundUser);

      if (!foundUser) {
        alert(`Invalid email or password!\n\nEmail entered: ${email}\nUsers in database: ${users.length}`);
        console.error('Login failed - no matching user');
        return false;
      }

      // Set as current user (without password)
      const userWithoutPassword: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        createdAt: foundUser.createdAt,
      };

      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      console.log('Login successful!', userWithoutPassword);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed! Check console for details.');
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out user:', user?.email);
    setUser(null);
    localStorage.removeItem('currentUser');
    console.log('Logout complete');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
