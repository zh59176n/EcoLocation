// src/components/LoginForm.test.jsx
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import LoginForm from './LoginForm';

// Partially mock firebase/auth to override signInWithEmailAndPassword while preserving other exports
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(),
  };
});

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear previous mock calls before each test
    signInWithEmailAndPassword.mockClear();
  });

  afterEach(() => {
    // Clean up the DOM after each test for a fresh start
    cleanup();
  });

  test('renders the login form with email and password fields and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    const signInButtons = screen.getAllByRole('button', { name: /sign in/i });
    expect(signInButtons.length).toBe(1);
  });

  test('displays error when fields are empty', async () => {
    render(<LoginForm />);
    const signInButtons = screen.getAllByRole('button', { name: /sign in/i });
    fireEvent.click(signInButtons[0]);
    expect(await screen.findByRole('alert')).toHaveTextContent(/please enter both email and password/i);
  });

  test('calls signInWithEmailAndPassword on valid submission', async () => {
    // Set up the mock to resolve successfully
    signInWithEmailAndPassword.mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    const signInButtons = screen.getAllByRole('button', { name: /sign in/i });
    fireEvent.click(signInButtons[0]);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    });
  });
});
