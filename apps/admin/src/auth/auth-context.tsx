import type { Admin } from 'src/api';

import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import { authApi } from 'src/api';
import { setUnauthorizedHandler } from 'src/lib/http';

// ----------------------------------------------------------------------

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  admin: Admin | null;
  status: AuthStatus;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * The session lives in an httpOnly cookie the browser sends automatically,
 * so the client only needs to ask "who am I?" on load.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const clearSession = useCallback(() => {
    setAdmin(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    let cancelled = false;
    authApi
      .me()
      .then(({ admin: current }) => {
        if (cancelled) return;
        setAdmin(current);
        setStatus('authenticated');
      })
      .catch(() => !cancelled && clearSession());

    setUnauthorizedHandler(clearSession);
    return () => {
      cancelled = true;
      setUnauthorizedHandler(undefined);
    };
  }, [clearSession]);

  const login = useCallback(async (username: string, password: string) => {
    const { admin: current } = await authApi.login(username, password);
    setAdmin(current);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => undefined);
    clearSession();
  }, [clearSession]);

  const value = useMemo(() => ({ admin, status, login, logout }), [admin, status, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
