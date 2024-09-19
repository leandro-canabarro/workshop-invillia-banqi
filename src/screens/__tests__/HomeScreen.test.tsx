import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

jest.mock('@/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: { orders: [] } })),
  delete: jest.fn(() => Promise.resolve()),
}));

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByText('Adicionar Pedido')).toBeTruthy();
  });

  it('navigates to OrderScreen on button press', () => {
    const navigate = jest.fn();
    const { getByText } = render(<HomeScreen navigation={{ navigate }} />);
    fireEvent.press(getByText('Adicionar Pedido'));
    expect(navigate).toHaveBeenCalledWith('Order', { setOrders: expect.any(Function) });
  });
});
