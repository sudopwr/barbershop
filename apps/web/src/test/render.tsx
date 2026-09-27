import { render } from '@testing-library/react';

import { ThemeProvider } from '@mui/material/styles';

import { theme } from 'src/theme/theme';

export const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
