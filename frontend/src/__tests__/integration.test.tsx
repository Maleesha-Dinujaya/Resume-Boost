import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';

// Mock the API
vi.mock('../services/api', () => ({
  api: {
    analyze: vi.fn().mockResolvedValue({
      id: '1',
      score: 85,
      matchedSkills: ['React', 'TypeScript'],
      improvementAreas: ['Add more metrics'],
      highlights: ['Built React applications']
    }),
    getHistory: vi.fn().mockResolvedValue({ items: [] }),
    verifyToken: vi.fn().mockResolvedValue({ email: 'test@example.com' })
  },
  setAuthToken: vi.fn(),
}));

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('complete user flow: landing → tailor → analyze → results', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // 1. Start on landing page
    expect(screen.getByText(/tailor your resume to/i)).toBeInTheDocument();
    
    // 2. Navigate to tailor workspace
    const startTailoringButton = screen.getByRole('link', { name: /start tailoring/i });
    await user.click(startTailoringButton);
    
    await waitFor(() => {
      expect(screen.getByText('Resume Tailor Workspace')).toBeInTheDocument();
    });
    
    // 3. Fill in the form
    const resumeTextarea = screen.getByPlaceholderText('Paste your resume content here...');
    const jobDescTextarea = screen.getByPlaceholderText('Paste the job description here...');
    
    await user.type(resumeTextarea, 'React developer with 5 years experience');
    await user.type(jobDescTextarea, 'Looking for senior React developer');
    
    // 4. Submit analysis
    const analyzeButton = screen.getByRole('button', { name: /analyze resume/i });
    await user.click(analyzeButton);
    
    // 5. Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // 6. Verify results are displayed
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText(/matched skills/i)).toBeInTheDocument();
    expect(screen.getByText(/areas for improvement/i)).toBeInTheDocument();
    expect(screen.getByText(/suggested highlights/i)).toBeInTheDocument();
  });

  test('navigation between pages works correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Navigate to How It Works
    const howItWorksLink = screen.getAllByRole('link', { name: /how it works/i })[0];
    await user.click(howItWorksLink);
    
    await waitFor(() => {
      expect(screen.getByText('How ResumeBoost Works')).toBeInTheDocument();
    });
    
    // Navigate to History (should redirect to login)
    const historyLink = screen.getByText('History');
    await user.click(historyLink);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
    
    // Navigate back to landing
    const logoLink = screen.getByText('ResumeBoost');
    await user.click(logoLink);
    
    await waitFor(() => {
      expect(screen.getByText(/tailor your resume to/i)).toBeInTheDocument();
    });
  });

  test('theme toggle works correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Find and click theme toggle button
    const themeToggle = screen.getAllByRole('button', { name: /toggle theme/i })[0];
    await user.click(themeToggle);
    
    // Check if dark class is applied to document
    expect(document.documentElement).toHaveClass('dark');
    
    // Toggle back to light mode
    await user.click(themeToggle);
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('404 page displays for invalid routes', async () => {
    // Mock window.history.pushState to navigate to invalid route
    window.history.pushState({}, '', '/invalid-route');
    
    render(<App />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to homepage/i })).toBeInTheDocument();
  });
});