'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CmsUser, UserRole } from '../lib/types';
import { apiClient, getAccessToken, setAccessToken } from '../lib/api-client';

interface AuthContextType {
  user: CmsUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CmsUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = 
    pathname === '/login' || 
    pathname === '/forgot-password' || 
    pathname === '/reset-password';

  // Session check on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = await apiClient.getMe();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  // Protected route guard
  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      router.push('/login');
    }
  }, [user, isLoading, isPublicRoute, router]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: authenticatedUser } = await apiClient.login(email, pass);
      setUser(authenticatedUser);
      router.push('/dashboard');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  // Switch role for operational testing & previewing RBAC permissions
  const switchRole = useCallback((newRole: UserRole) => {
    setUser(prev => prev ? { ...prev, role: newRole } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'viewer',
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
