import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Screen from '../components/Screen';
import { getJson } from '../api/client';

export default function OrderDetailScreen({ route }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getJson(`/orders/${route.params.id}`).then(setOrder);
  }, [route.params.id]);

  if (!order) return <Screen><Text>Loading…</Text></Screen>;

  return (
    <Screen>
      <Text accessibilityRole="header">{order.reference}</Text>
      <Text>Placed {order.placedAt}</Text>
    </Screen>
  );
}
