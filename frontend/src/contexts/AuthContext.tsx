import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken as apiSetAuthToken } from '../services/api';
import { storage } from '../services/storage';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiSetAuthToken(token);
  }, [token]);

  const login = async (email: string, password: string) => {
    storage.clear();
    const res = await api.login(email, password);
    setToken(res.access_token);
    setUserEmail(email);
    storage.setAuthToken(res.access_token, email);
  };

  const register = async (email: string, password: string) => {
    storage.clear();
    const res = await api.register(email, password);
    setToken(res.access_token);
    setUserEmail(email);
    storage.setAuthToken(res.access_token, email);
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    apiSetAuthToken(null);
    storage.clear();
    storage.clearAuthToken();
    navigate('/');
  };

  useEffect(() => {
    const savedToken = storage.getAuthToken();
    const savedEmail = storage.getAuthEmail();
    if (savedToken) {
      apiSetAuthToken(savedToken);
      api
        .verifyToken()
        .then((res) => {
          setToken(savedToken);
          setUserEmail(res.email || savedEmail);
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, userEmail, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

