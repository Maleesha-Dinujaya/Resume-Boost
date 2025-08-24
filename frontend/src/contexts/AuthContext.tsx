import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken as apiSetAuthToken } from '../services/api';
import { storage } from '../services/storage';
import { AuthContext } from './authContext';

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

