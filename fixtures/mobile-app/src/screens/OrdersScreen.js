import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import { getJson } from '../api/client';
import { useOnline } from '../hooks/useOnline';
import { theme } from '../theme';

export default function OrdersScreen({ navigation }) {
  const online = useOnline();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setOrders(await getJson('/orders'));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (online) load();
  }, [online, load]);

  return (
    <Screen>
      {!online && <Text style={styles.banner}>You are offline. Orders will refresh when you reconnect.</Text>}
      {failed && <Text style={styles.error}>Orders could not be loaded.</Text>}
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        refreshing={loading}
        onRefresh={online ? load : undefined}
        ListEmptyComponent={!loading && !failed ? <Text>No orders yet.</Text> : null}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Order ${item.reference}`}
            style={styles.row}
            onPress={() => navigation.navigate('OrderDetail', { id: item.id })}
          >
            <View>
              <Text style={styles.reference}>{item.reference}</Text>
              <Text style={styles.muted}>{item.placedAt}</Text>
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: theme.colors.banner, padding: theme.spacing.sm, marginBottom: theme.spacing.sm },
  error: { color: theme.colors.danger, marginBottom: theme.spacing.sm },
  row: { minHeight: theme.minTouchTarget, paddingVertical: theme.spacing.sm },
  reference: { fontSize: theme.type.body, color: theme.colors.text },
  muted: { fontSize: theme.type.small, color: theme.colors.textMuted },
});
