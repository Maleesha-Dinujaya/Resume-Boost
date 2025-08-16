import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken as apiSetAuthToken } from '../services/api';
import { storage } from '../services/storage';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => storage.getAuthToken());
  const [userEmail, setUserEmail] = useState<string | null>(() => storage.getAuthEmail());
  const navigate = useNavigate();

  useEffect(() => {
    apiSetAuthToken(token);
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setToken(res.access_token);
    setUserEmail(email);
    storage.setAuthToken(res.access_token, email);
  };

  const register = async (email: string, password: string) => {
    const res = await api.register(email, password);
    setToken(res.access_token);
    setUserEmail(email);
    storage.setAuthToken(res.access_token, email);
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    apiSetAuthToken(null);
    storage.clearAuthToken();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
