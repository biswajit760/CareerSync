'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, tokenManager } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (googleId: string, email: string, name: string, profilePicture?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.get();
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        setUser(response.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        tokenManager.remove();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    tokenManager.set(response.token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authAPI.register(name, email, password);
    tokenManager.set(response.token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const googleLogin = async (googleId: string, email: string, name: string, profilePicture?: string) => {
    const response = await authAPI.googleAuth(googleId, email, name, profilePicture);
    tokenManager.set(response.token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const logout = () => {
    tokenManager.remove();
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
