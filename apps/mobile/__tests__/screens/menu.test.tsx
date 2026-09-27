import { fireEvent, screen } from '@testing-library/react-native';

import MenuScreen from '../../app/(tabs)/menu';
import { catalog } from '../fixtures';
import { catalogState, renderWithTheme } from '../test-utils';

const mockUseCatalog = jest.fn();
jest.mock('@/hooks/use-catalog', () => ({ useCatalog: () => mockUseCatalog() }));

const mockSetParams = jest.fn();
let mockParams: { category?: string } = {};
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), setParams: mockSetParams }),
  useLocalSearchParams: () => mockParams,
}));

describe('Menu screen', () => {
  beforeEach(() => {
    mockParams = {};
    mockSetParams.mockClear();
    mockUseCatalog.mockReturnValue(catalogState({ data: catalog }));
  });

  it('lists all categories with their services', () => {
    renderWithTheme(<MenuScreen />);

    expect(screen.getByRole('header', { name: 'Haircuts' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Beard & Shave' })).toBeOnTheScreen();
    expect(screen.getByText('Classic Cut')).toBeOnTheScreen();
    expect(screen.getByText('Hot Towel Shave')).toBeOnTheScreen();
  });

  it('shows only the category passed in the route', () => {
    mockParams = { category: 'beard-and-shave' };
    renderWithTheme(<MenuScreen />);

    expect(screen.getByText('Hot Towel Shave')).toBeOnTheScreen();
    expect(screen.queryByText('Classic Cut')).not.toBeOnTheScreen();
  });

  it('updates the route when a category chip is tapped', () => {
    renderWithTheme(<MenuScreen />);
    fireEvent.press(screen.getByTestId('chip-haircuts'));
    expect(mockSetParams).toHaveBeenCalledWith({ category: 'haircuts' });
  });

  it('filters by search text and explains empty results', () => {
    renderWithTheme(<MenuScreen />);

    fireEvent.changeText(screen.getByTestId('menu-search'), 'towel');
    expect(screen.getByText('Hot Towel Shave')).toBeOnTheScreen();
    expect(screen.queryByText('Skin Fade')).not.toBeOnTheScreen();

    fireEvent.changeText(screen.getByTestId('menu-search'), 'perm');
    expect(screen.getByText('No services match “perm”')).toBeOnTheScreen();
  });

  it('shows a skeleton while loading', () => {
    mockUseCatalog.mockReturnValue(catalogState({ isLoading: true }));
    renderWithTheme(<MenuScreen />);
    expect(screen.getByTestId('loading-state')).toBeOnTheScreen();
  });

  it('offers a retry when the request fails', () => {
    const state = catalogState({ isError: true, error: new Error("Can't reach the shop right now.") });
    mockUseCatalog.mockReturnValue(state);
    renderWithTheme(<MenuScreen />);

    expect(screen.getByText("Can't reach the shop right now.")).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Try again'));
    expect(state.refetch).toHaveBeenCalled();
  });

  it('shows a friendly message when the menu is empty', () => {
    mockUseCatalog.mockReturnValue(catalogState({ data: { categories: [], featured: [], priceFrom: null } }));
    renderWithTheme(<MenuScreen />);
    expect(screen.getByText('Our menu is being updated')).toBeOnTheScreen();
  });
});
