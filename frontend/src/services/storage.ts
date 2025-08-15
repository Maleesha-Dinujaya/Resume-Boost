interface StoredData {
  resumeText: string;
  jobDescription: string;
  targetRole: string;
  seniority: string;
  emphasis: string[];
}

const STORAGE_KEY = 'resumeBoost_data';

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
  }
};