export interface AnalyzeRequest {
  resumeText: string;
  jobDescription?: string;
  emphasis?: string[];
}

export interface AnalyzeResponse {
  id: string;
  score: number;
  matchedSkills: string[];
  improvementAreas: string[];
  highlights: string[];
}

// Token plumbing — NEW
let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
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

const API_BASE_URL = 'http://localhost:8000';

export const api = {
  async analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        resume_text: request.resumeText,
        job_description: request.jobDescription,
        emphasis: request.emphasis,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze resume');
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
