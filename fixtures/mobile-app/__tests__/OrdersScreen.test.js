import { render, screen } from '@testing-library/react-native';
import OrdersScreen from '../src/screens/OrdersScreen';

jest.mock('../src/hooks/useOnline', () => ({ useOnline: () => false }));

test('shows the offline banner and fires no request when offline', () => {
  global.fetch = jest.fn();
  render(<OrdersScreen navigation={{ navigate: jest.fn() }} />);
  expect(screen.getByText(/You are offline/)).toBeTruthy();
  expect(global.fetch).not.toHaveBeenCalled();
});
