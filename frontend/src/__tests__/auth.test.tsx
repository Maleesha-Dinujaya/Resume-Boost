import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { api } from '../services/api';
import { storage } from '../services/storage';

vi.mock('../services/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
    analyze: vi.fn(),
    getHistory: vi.fn().mockResolvedValue({ items: [] })
  },
  setAuthToken: vi.fn(),
}));

describe('Authentication flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('login page authenticates and redirects', async () => {
    (api.login as ReturnType<typeof vi.fn>).mockResolvedValue({ access_token: 'token123', token_type: 'bearer' });
    const user = userEvent.setup();
    window.history.pushState({}, '', '/login');
    render(<App />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(api.login).toHaveBeenCalledWith('test@example.com', 'secret'));
    expect(storage.getAuthToken()).toBe('token123');
    await waitFor(() => {
      expect(screen.getByText('Resume Tailor Workspace')).toBeInTheDocument();
    });
    expect(screen.getByText(/signed in as test@example.com/i)).toBeInTheDocument();
  });

  test('register page creates account and redirects', async () => {
    (api.register as ReturnType<typeof vi.fn>).mockResolvedValue({ access_token: 'tok456', token_type: 'bearer' });
    const user = userEvent.setup();
    window.history.pushState({}, '', '/register');
    render(<App />);

    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/password/i), 'pass');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(api.register).toHaveBeenCalledWith('new@example.com', 'pass'));
    expect(storage.getAuthToken()).toBe('tok456');
    await waitFor(() => {
      expect(screen.getByText('Resume Tailor Workspace')).toBeInTheDocument();
    });
  });

  test('header shows login when signed out and logout when signed in', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();

    (api.login as ReturnType<typeof vi.fn>).mockResolvedValue({ access_token: 'zzz', token_type: 'bearer' });
    await user.click(screen.getByRole('link', { name: /login/i }));
    await user.type(screen.getByLabelText(/email/i), 'head@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret');
    await user.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => expect(screen.getByText(/signed in as head@example.com/i)).toBeInTheDocument());
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
