import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TailorWorkspace } from '../pages/TailorWorkspace';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the toast hook
const mockShowToast = jest.fn();
jest.mock('../components/Toast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
    ToastContainer: () => <div data-testid="toast-container" />
  })
}));

// Mock the API
jest.mock('../services/mockApi', () => ({
  mockApi: {
    analyze: jest.fn().mockResolvedValue({
      id: '1',
      score: 85,
      matchedSkills: ['React', 'TypeScript', 'Node.js'],
      improvementAreas: ['Add more metrics', 'Include certifications'],
      highlights: ['Built 3 React apps', 'Led team of 5 developers']
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
    jest.clearAllMocks();
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
    const { mockApi } = require('../services/mockApi');
    renderWithProviders(<TailorWorkspace />);
    
    const resumeTextarea = screen.getByPlaceholderText('Paste your resume content here...');
    const jobDescTextarea = screen.getByPlaceholderText('Paste the job description here...');
    const analyzeButton = screen.getByRole('button', { name: /analyze resume/i });
    
    fireEvent.change(resumeTextarea, { target: { value: 'Software engineer with React experience' } });
    fireEvent.change(jobDescTextarea, { target: { value: 'Looking for React developer' } });
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(mockApi.analyze).toHaveBeenCalledWith({
        resumeText: 'Software engineer with React experience',
        jobDescription: 'Looking for React developer',
        role: undefined,
        seniority: undefined,
        emphasis: undefined
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
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