import { createContext } from 'react';

export interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializing: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
