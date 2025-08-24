import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { TailorWorkspace } from '../pages/TailorWorkspace';
import { ThemeProvider } from '../contexts/ThemeContext';
import { api } from '../services/api';

// Mock the toast hook
const mockShowToast = vi.fn();
vi.mock('../hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
    ToastContainer: () => <div data-testid="toast-container" />
  })
}));

// Mock the API
vi.mock('../services/api', () => ({
  api: {
    analyze: vi.fn().mockResolvedValue({
      id: '1',
      score: 85,
      matchedSkills: ['React', 'TypeScript', 'Node.js'],
      improvementAreas: ['Add more metrics', 'Include certifications'],
      highlights: ['Built 3 React apps', 'Led team of 5 developers'],
      breakdown: { skill_match: 40, semantic_similarity: 25, ats_optimization: 15 },
      weakRequirements: ['GraphQL experience'],
      evidence: [
        { jd: 'Experience with React', resume: 'Worked with React', similarity: 0.9 }
      ],
    })
  }
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('TailorWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('renders form elements correctly', () => {
    renderWithProviders(<TailorWorkspace />);
    
    expect(screen.getByText('Resume Tailor Workspace')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paste your resume content here...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paste the job description here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze resume/i })).toBeInTheDocument();
  });

  test('shows validation error when trying to analyze without resume text', async () => {
    renderWithProviders(<TailorWorkspace />);
    
    const jobDescTextarea = screen.getByPlaceholderText('Paste the job description here...');
    const analyzeButton = screen.getByRole('button', { name: /analyze resume/i });
    
    fireEvent.change(jobDescTextarea, { target: { value: 'Job description here' } });
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('error', 'Please provide your resume text');
    });
  });

  test('shows validation error when trying to analyze without job description', async () => {
    renderWithProviders(<TailorWorkspace />);
    
    const resumeTextarea = screen.getByPlaceholderText('Paste your resume content here...');
    const analyzeButton = screen.getByRole('button', { name: /analyze resume/i });
    
    fireEvent.change(resumeTextarea, { target: { value: 'Resume content here' } });
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('error', 'Please provide the job description');
    });
  });

  test('successfully analyzes resume and shows results', async () => {
    renderWithProviders(<TailorWorkspace />);
    
    const resumeTextarea = screen.getByPlaceholderText('Paste your resume content here...');
    const jobDescTextarea = screen.getByPlaceholderText('Paste the job description here...');
    const analyzeButton = screen.getByRole('button', { name: /analyze resume/i });
    
    fireEvent.change(resumeTextarea, { target: { value: 'Software engineer with React experience' } });
    fireEvent.change(jobDescTextarea, { target: { value: 'Looking for React developer' } });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(api.analyze).toHaveBeenCalledWith({
        resumeText: 'Software engineer with React experience',
        jobDescription: 'Looking for React developer',
        emphasis: undefined,
        role: undefined,
        seniority: undefined,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Detailed Analysis')).toBeInTheDocument();
      expect(screen.getByText('Weak Requirements')).toBeInTheDocument();
      expect(screen.getByText('GraphQL experience')).toBeInTheDocument();
      expect(screen.getByText('Experience with React')).toBeInTheDocument();
    });
  });

  test('resets form when reset button is clicked', async () => {
    renderWithProviders(<TailorWorkspace />);
    
    const resumeTextarea = screen.getByPlaceholderText('Paste your resume content here...');
    const jobDescTextarea = screen.getByPlaceholderText('Paste the job description here...');
    const resetButton = screen.getByRole('button', { name: /reset/i });
    
    fireEvent.change(resumeTextarea, { target: { value: 'Resume content' } });
    fireEvent.change(jobDescTextarea, { target: { value: 'Job description' } });
    
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(resumeTextarea).toHaveValue('');
      expect(jobDescTextarea).toHaveValue('');
      expect(mockShowToast).toHaveBeenCalledWith('success', 'Form cleared successfully');
    });
  });

  test('toggles emphasis tags correctly', () => {
    renderWithProviders(<TailorWorkspace />);
    
    const leadershipTag = screen.getByRole('button', { name: 'Leadership' });
    
    // Initially not selected
    expect(leadershipTag).toHaveClass('bg-gray-100');
    
    // Click to select
    fireEvent.click(leadershipTag);
    expect(leadershipTag).toHaveClass('bg-blue-100');
    
    // Click again to deselect
    fireEvent.click(leadershipTag);
    expect(leadershipTag).toHaveClass('bg-gray-100');
  });
});