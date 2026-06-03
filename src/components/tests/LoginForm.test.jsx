import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(),
  };
});

vi.mock('firebase/messaging', () => ({
  getMessaging: vi.fn(() => ({})),
  onMessage: vi.fn(),
}));

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

global.Notification = {
  requestPermission: vi.fn(() => Promise.resolve("granted")),
};

let rendered;

describe('LoginForm', () => {
  beforeEach(() => {
    signInWithEmailAndPassword.mockClear();
    rendered = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);
  });

  afterEach(() => {
    cleanup();
  });

  test('renders the login form with email and password fields and submit button', () => {
    rendered(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    const signInButtons = screen.getAllByRole('button', { name: /sign in/i });
    expect(signInButtons.length).toBe(1);
  });

  test('displays error when fields are empty', async () => {
    rendered(<LoginForm />);
    const signInButtons = screen.getAllByRole('button', { name: /sign in/i });
    fireEvent.click(signInButtons[0]);
    expect(await screen.findByRole('alert')).toHaveTextContent(/please enter both email and password/i);
  });

  test('calls signInWithEmailAndPassword on valid submission', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    rendered(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    const signInButtons = screen.getAllByRole('button', { name: /sign in/i });
    fireEvent.click(signInButtons[0]);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    });
  });

  test('has no accessibility violations', async () => {
    const { container } = rendered(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
