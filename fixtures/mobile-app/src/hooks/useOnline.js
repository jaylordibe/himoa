import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected))), []);
  return online;
}
