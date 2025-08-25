import { storage } from './storage';

export interface AnalyzeRequest {
  resumeText: string;
  jobDescription?: string;
  emphasis?: string[];
  role?: string;
  seniority?: string;
}

export interface AnalyzeResponse {
  id: string;
  score: number;
  matchedSkills: string[];
  improvementAreas: string[];
  highlights: string[];
  breakdown?: { skill_match: number; semantic_similarity: number; ats_optimization: number };
  weakRequirements?: string[];
  evidence?: { jd: string; resume: string; similarity: number }[];
}

export interface RewriteResponse {
  alternatives: string[];
}

// Token plumbing
let authToken: string | null = storage.getAuthToken();
export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    storage.setAuthToken(token, storage.getAuthEmail() ?? undefined);
  } else {
    storage.clearAuthToken();
  }
}

function authHeaders(extra?: Record<string, string>) {
  return authToken
    ? { Authorization: `Bearer ${authToken}`, ...(extra || {}) }
    : { ...(extra || {}) };
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  role: string;
  score: number;
}

export interface HistoryDetail extends AnalyzeResponse {
  createdAt: string;
  resumePreview?: string;
  jobTitle?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Backend base URL (configurable via VITE_API_URL)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data: AuthResponse = await response.json();
    setAuthToken(data.access_token);
    return data;
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      // Try to extract a meaningful error message from the backend
      let message = 'Registration failed';
      try {
        const errorData = await response.json();
        message = errorData.detail || message;
      } catch {
        // ignore json parsing errors
      }
      throw new Error(message);
    }
    const data: AuthResponse = await response.json();
    setAuthToken(data.access_token);
    return data;
  },

  async verifyToken(): Promise<{ email: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    return response.json();
  },
  async analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        resume_text: request.resumeText,
        job_description: request.jobDescription,
        emphasis: request.emphasis,
        role: request.role,
        seniority: request.seniority,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }

    return response.json();
  },

  async rewriteBullet(text: string): Promise<RewriteResponse> {
    const response = await fetch(`${API_BASE_URL}/rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) {
      throw new Error('Failed to rewrite bullet');
    }
    return response.json();
  },

  async getHistory(): Promise<{ items: HistoryItem[] }> {
    const response = await fetch(`${API_BASE_URL}/history`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to load history');
    }
    return response.json();
  },

  async getHistoryItem(id: string): Promise<HistoryDetail | null> {
    const response = await fetch(`${API_BASE_URL}/history/${id}`, {
      headers: authHeaders(),
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to load analysis');
    }
    return response.json();
  },

  async deleteHistoryItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/history/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete analysis');
    }
  },
};
