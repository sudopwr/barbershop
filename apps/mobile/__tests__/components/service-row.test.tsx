import { fireEvent, screen } from '@testing-library/react-native';

import { ServiceRow } from '@/components/service-row';

import { catalog } from '../fixtures';
import { renderWithTheme } from '../test-utils';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('<ServiceRow />', () => {
  const fade = catalog.categories[0]!.services[1]!;

  it('shows name, price, duration and description', () => {
    renderWithTheme(<ServiceRow service={fade} />);

    expect(screen.getByText('Skin Fade')).toBeOnTheScreen();
    expect(screen.getByText('₹450')).toBeOnTheScreen();
    expect(screen.getByText('45 min')).toBeOnTheScreen();
    expect(screen.getByText('Down to the skin')).toBeOnTheScreen();
  });

  it('announces a helpful label to screen readers', () => {
    renderWithTheme(<ServiceRow service={fade} />);
    expect(screen.getByRole('button', { name: 'Skin Fade, ₹450, 45 min' })).toBeOnTheScreen();
  });

  it('opens the service details when tapped', () => {
    renderWithTheme(<ServiceRow service={fade} />);
    fireEvent.press(screen.getByTestId('service-s2'));
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/service/[id]', params: { id: 's2' } });
  });
});
