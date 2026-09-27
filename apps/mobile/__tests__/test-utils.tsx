import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { paperTheme } from '@/theme';

export const renderWithTheme = (ui: React.ReactElement) => render(<PaperProvider theme={paperTheme}>{ui}</PaperProvider>);

type CatalogState = Partial<{
  data: unknown;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefetching: boolean;
}>;

/** Shape returned by the mocked useCatalog() hook. */
export const catalogState = (state: CatalogState = {}) => ({
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
  isRefetching: false,
  refetch: jest.fn(),
  ...state,
});
