import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OrderScreen from '../OrderScreen';
import api from '@/api';

jest.mock('@/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: { order: { id: 1, name: 'Pedido 1', status: 'Pendente' } } })),
  put: jest.fn(() => Promise.resolve({ data: { order: { id: 1, name: 'Pedido 1', status: 'Pendente' } } })),
}));

describe('OrderScreen', () => {
  const mockNavigation = { goBack: jest.fn(), setOptions: jest.fn() };
  const mockSetOrders = jest.fn();

  it('lida com erros da API', async () => {
    // Mock da API para retornar um erro
    api.post.mockImplementationOnce(() => Promise.reject(new Error('Erro da API')));

    // Renderiza o componente
    const { getByPlaceholderText, getByText } = render(
      <OrderScreen route={{ params: { setOrders: mockSetOrders } }} navigation={mockNavigation} />
    );

    // Simula a interação do usuário
    fireEvent.changeText(getByPlaceholderText('Nome do Pedido'), 'Pedido 1');
    fireEvent.changeText(getByPlaceholderText('Status do Pedido'), 'Pendente');
    fireEvent.press(getByText('Salvar'));

    // Verifica o comportamento esperado
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/orders', { name: 'Pedido 1', status: 'Pendente' });
      expect(mockSetOrders).not.toHaveBeenCalled();
      expect(mockNavigation.goBack).not.toHaveBeenCalled();
    });
  });
});
