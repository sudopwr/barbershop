import { Navigate, useLocation } from 'react-router';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuth } from './auth-context';

// ----------------------------------------------------------------------

function SplashScreen() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress color="primary" aria-label="Loading" />
    </Box>
  );
}

/** Only signed-in admins get through; everyone else goes to /sign-in. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <SplashScreen />;
  if (status === 'unauthenticated') {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/sign-in?returnTo=${returnTo}`} replace />;
  }
  return <>{children}</>;
}

/** Keeps signed-in admins away from the sign-in page. */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <SplashScreen />;
  if (status === 'authenticated') {
    const returnTo = new URLSearchParams(location.search).get('returnTo');
    // Only allow in-app paths to avoid open redirects
    const target = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
    return <Navigate to={target} replace />;
  }
  return <>{children}</>;
}
