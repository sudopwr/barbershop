import userEvent from '@testing-library/user-event';
import { it, vi, expect, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import { ApiError } from 'src/lib/http';
import { renderWithProviders } from 'src/test/render';

import { SignInView } from './sign-in-view';

const login = vi.fn();
vi.mock('src/auth', () => ({ useAuth: () => ({ login }) }));

describe('<SignInView />', () => {
  beforeEach(() => login.mockReset());

  it('validates required fields before calling the API', async () => {
    renderWithProviders(<SignInView />);

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('signs in with the trimmed username', async () => {
    login.mockResolvedValue(undefined);
    renderWithProviders(<SignInView />);

    await userEvent.type(screen.getByLabelText(/username/i), '  admin ');
    await userEvent.type(screen.getByLabelText(/^password/i), 'secret-pass');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('admin', 'secret-pass'));
  });

  it('shows the server message when credentials are wrong', async () => {
    login.mockRejectedValue(new ApiError(401, 'UNAUTHORIZED', 'Invalid username or password'));
    renderWithProviders(<SignInView />);

    await userEvent.type(screen.getByLabelText(/username/i), 'admin');
    await userEvent.type(screen.getByLabelText(/^password/i), 'nope');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid username or password');
  });

  it('toggles password visibility', async () => {
    renderWithProviders(<SignInView />);
    const password = screen.getByLabelText(/^password/i);

    expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(password).toHaveAttribute('type', 'text');
  });
});
