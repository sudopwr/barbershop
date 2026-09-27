import type { Catalog } from 'src/api/catalog';

import { useState, useEffect, useCallback } from 'react';

import { fetchCatalog } from 'src/api/catalog';

type State =
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: Catalog; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error };

export function useCatalog() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    fetchCatalog(controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', error });
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
