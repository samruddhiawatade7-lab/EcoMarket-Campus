import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, Role, User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(() => authService.getStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ecomarket_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser({
            token,
            type: 'Bearer',
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            profileImage: userData.profileImage
          });
        } catch (err) {
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await authService.login(email, pass);
    setUser(data);
    setToken(data.token);
    return data;
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    setUser(res);
    setToken(res.token);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(prev => prev ? {
          ...prev,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profileImage: userData.profileImage
        } : null);
      } catch (e) {}
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated, isAdmin, isSeller, login, register, logout, refreshUser, loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
