import { screen } from '@testing-library/react-native';

import ServiceScreen from '../../app/service/[id]';
import { catalog } from '../fixtures';
import { catalogState, renderWithTheme } from '../test-utils';

const mockUseCatalog = jest.fn();
jest.mock('@/hooks/use-catalog', () => ({ useCatalog: () => mockUseCatalog() }));

let mockId = 's2';
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({ id: mockId }),
  Stack: { Screen: () => null },
}));

describe('Service screen', () => {
  beforeEach(() => mockUseCatalog.mockReturnValue(catalogState({ data: catalog })));

  it('shows price, duration, description and a call button', () => {
    mockId = 's2';
    renderWithTheme(<ServiceScreen />);

    expect(screen.getByTestId('service-name')).toHaveTextContent('Skin Fade');
    expect(screen.getByTestId('service-price')).toHaveTextContent('₹450');
    expect(screen.getByText('45 min')).toBeOnTheScreen();
    expect(screen.getByText('House favourite')).toBeOnTheScreen();
    expect(screen.getByText('Call the shop')).toBeOnTheScreen();
  });

  it('suggests other services from the same category', () => {
    mockId = 's2';
    renderWithTheme(<ServiceScreen />);

    expect(screen.getByText('More in Haircuts')).toBeOnTheScreen();
    expect(screen.getByText('Classic Cut')).toBeOnTheScreen();
    expect(screen.getByText('Kids Cut')).toBeOnTheScreen();
  });

  it('handles a service that was removed from the menu', () => {
    mockId = 'gone';
    renderWithTheme(<ServiceScreen />);
    expect(screen.getByText("This service isn't on the menu anymore")).toBeOnTheScreen();
  });
});
