'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        // We don't have a specific "me" endpoint in the views provided, 
        // but we can likely infer potential logic or add one.
        // For now, let's assume valid token means logged in or decode it if needed.
        // NOTE: Ideally add a /auth/me/ endpoint to Django to get user details.
        // For this MVP, we might skip user details or store them in localStorage on login.
        
        // Let's rely on localStorage user data for now if available
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      
      // Since the login response in views.py only returns tokens, 
      // we'll set a basic user object.
      // Ideally update backend to return user info or fetch it here.
      const userData = { id: 0, username, email: '' }; // Placeholder
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await api.post('/auth/register/', { username, email, password });
      // After register, auto-login or redirect to login
      await login(username, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
