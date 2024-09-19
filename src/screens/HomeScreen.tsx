import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation';
import api from '@/api';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface Order {
  id: number;
  name: string;
  status: string;
}

export default function HomeScreen({ navigation }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await api.get('/orders');
    setOrders(response.data.orders);
  };

  const addOrder = () => {
    navigation.navigate('Order', { setOrders });
  };

  const editOrder = (order: Order) => {
    navigation.navigate('Order', { order, setOrders });
  };

  const deleteOrder = async (id: number) => {
    await api.delete(`/orders/${id}`);
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <View>
      <Button title="Adicionar Pedido" onPress={addOrder} />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>Status: {item.status}</Text>
            <Button title="Editar" onPress={() => editOrder(item)} />
            <Button title="Excluir" onPress={() => deleteOrder(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
