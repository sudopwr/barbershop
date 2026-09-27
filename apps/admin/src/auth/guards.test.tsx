import { Route, Routes } from 'react-router';
import { screen } from '@testing-library/react';
import { it, vi, expect, describe } from 'vitest';

import { renderWithProviders } from 'src/test/render';

import { AuthGuard, GuestGuard } from './guards';

const auth = vi.hoisted(() => ({ status: 'loading' as 'loading' | 'authenticated' | 'unauthenticated' }));
vi.mock('./auth-context', () => ({ useAuth: () => auth }));

function renderAt(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/sign-in" element={<GuestGuard>sign-in page</GuestGuard>} />
      <Route path="/services" element={<AuthGuard>services page</AuthGuard>} />
      <Route path="/" element={<AuthGuard>dashboard</AuthGuard>} />
    </Routes>,
    { route }
  );
}

describe('route guards', () => {
  it('shows a spinner while the session is being checked', () => {
    auth.status = 'loading';
    renderAt('/services');
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('sends visitors without a session to sign-in', () => {
    auth.status = 'unauthenticated';
    renderAt('/services');
    expect(screen.getByText('sign-in page')).toBeInTheDocument();
  });

  it('lets signed-in admins through', () => {
    auth.status = 'authenticated';
    renderAt('/services');
    expect(screen.getByText('services page')).toBeInTheDocument();
  });

  it('returns a signed-in admin to the page they asked for', () => {
    auth.status = 'authenticated';
    renderAt('/sign-in?returnTo=%2Fservices');
    expect(screen.getByText('services page')).toBeInTheDocument();
  });

  it('ignores off-site returnTo values', () => {
    auth.status = 'authenticated';
    renderAt('/sign-in?returnTo=%2F%2Fevil.example.com');
    expect(screen.getByText('dashboard')).toBeInTheDocument();
  });
});
