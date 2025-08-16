interface StoredData {
  resumeText: string;
  jobDescription: string;
  targetRole: string;
  seniority: string;
  emphasis: string[];
}

const STORAGE_KEY = 'resumeBoost_data';
const AUTH_KEY = 'resumeBoost_auth';

export const storage = {
  save(data: Partial<StoredData>): void {
    try {
      const existing = this.load();
      const updated = { ...existing, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  load(): Partial<StoredData> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return {};
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  },

  // ----- Auth token helpers -----
  getAuthToken(): string | null {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.token as string;
    } catch (error) {
      console.warn('Failed to load auth token:', error);
      return null;
    }
  },

  getAuthEmail(): string | null {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.email as string | null;
    } catch (error) {
      console.warn('Failed to load auth email:', error);
      return null;
    }
  },

  setAuthToken(token: string, email?: string): void {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ token, email }));
    } catch (error) {
      console.warn('Failed to save auth token:', error);
    }
  },

  clearAuthToken(): void {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.warn('Failed to clear auth token:', error);
    }
  }
};