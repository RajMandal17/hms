import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    const savedUser = authService.getCurrentUser();
    console.log('AuthContext loaded user from localStorage:', savedUser);
    console.log('AuthContext loaded token from localStorage:', token);
    if (savedUser && !savedUser.role) {
      alert('User loaded from localStorage has no role! Check backend login response and localStorage.');
    }
    if (token && savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    if (user?.roles && Array.isArray(user.roles)) {
      return user.roles.map((r: string) => r.toUpperCase()).includes(role.toUpperCase());
    }
    if (user?.role) {
      return user.role.toUpperCase() === role.toUpperCase();
    }
    return false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (user?.roles && Array.isArray(user.roles)) {
      return user.roles.map((r: string) => r.toUpperCase()).some((ur: string) => roles.map(r => r.toUpperCase()).includes(ur));
    }
    if (user?.role) {
      return roles.map(r => r.toUpperCase()).includes(user.role.toUpperCase());
    }
    return false;
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};