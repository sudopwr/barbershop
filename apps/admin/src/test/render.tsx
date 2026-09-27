import type { RenderOptions } from '@testing-library/react';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from 'src/theme/theme-provider';

import { SnackbarProvider } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type Options = RenderOptions & { route?: string };

/** Renders with the same providers the app uses (minus auth, which tests control). */
export function renderWithProviders(ui: React.ReactElement, { route = '/', ...options }: Options = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SnackbarProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>,
    options
  );
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
