import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const { token, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
