import { useMemo, useState, useContext, useCallback, createContext } from 'react';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

// ----------------------------------------------------------------------

type Severity = 'success' | 'error' | 'info' | 'warning';
type Toast = { id: number; message: string; severity: Severity };
type Notify = (message: string, severity?: Severity) => void;

const SnackbarContext = createContext<Notify | undefined>(undefined);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const notify = useCallback<Notify>((message, severity = 'success') => {
    setToast({ id: Date.now(), message, severity });
  }, []);

  const value = useMemo(() => notify, [notify]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast?.id}
        open={!!toast}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setToast(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {toast ? (
          <Alert variant="filled" severity={toast.severity} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useNotify() {
  const notify = useContext(SnackbarContext);
  if (!notify) throw new Error('useNotify must be used inside <SnackbarProvider>');
  return notify;
}
