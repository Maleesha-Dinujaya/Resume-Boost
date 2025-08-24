import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/auth-context';

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
