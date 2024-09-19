import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/api';

type OrderScreenRouteProp = RouteProp<RootStackParamList, 'Order'>;
type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Order'>;

interface Props {
  route: OrderScreenRouteProp;
  navigation: OrderScreenNavigationProp;
}

interface Order {
  id: number;
  name: string;
  status: string;
}

export default function OrderScreen({ route, navigation }: Props) {
  const { order, setOrders } = route.params;
  const [name, setName] = useState(order ? order.name : '');
  const [status, setStatus] = useState(order ? order.status : '');

  useEffect(() => {
    navigation.setOptions({
      title: order ? 'Editar Pedido' : 'Novo Pedido',
    });
  }, [navigation, order]);

  const saveOrder = async () => {
    try {
      if (order) {
        const response = await api.put(`/orders/${order.id}`, { name, status });
        setOrders(prevOrders => prevOrders.map(o => o.id === order.id ? response.data.order : o));
      } else {
        const response = await api.post('/orders', { name, status });
        setOrders(prevOrders => [...prevOrders, response.data.order]);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o pedido. Tente novamente.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nome do Pedido"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Status do Pedido"
        value={status}
        onChangeText={setStatus}
      />
      <Button title="Salvar" onPress={saveOrder} />
    </View>
  );
}
