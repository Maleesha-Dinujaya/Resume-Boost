import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { ThemeProvider } from '../contexts/ThemeContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Landing Page', () => {
  test('renders main heading and call-to-action', () => {
    renderWithProviders(<Landing />);
    
    expect(screen.getByText(/tailor your resume to/i)).toBeInTheDocument();
    expect(screen.getByText(/land your dream job/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start tailoring/i })).toBeInTheDocument();
  });

  test('displays feature benefits', () => {
    renderWithProviders(<Landing />);
    
    expect(screen.getByText('Smart Matching')).toBeInTheDocument();
    expect(screen.getByText('Instant Insights')).toBeInTheDocument();
    expect(screen.getByText('Higher Success Rate')).toBeInTheDocument();
  });

  test('has working navigation links', () => {
    renderWithProviders(<Landing />);
    
    const startTailoringLink = screen.getByRole('link', { name: /start tailoring/i });
    const howItWorksLink = screen.getByRole('link', { name: /how it works/i });
    
    expect(startTailoringLink).toHaveAttribute('href', '/tailor');
    expect(howItWorksLink).toHaveAttribute('href', '/how-it-works');
  });

  test('displays call-to-action section', () => {
    renderWithProviders(<Landing />);
    
    expect(screen.getByText(/ready to boost your resume/i)).toBeInTheDocument();
    expect(screen.getByText(/join thousands of job seekers/i)).toBeInTheDocument();
  });
});