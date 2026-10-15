import * as SecureStore from 'expo-secure-store';

const KEY = 'session-token';

export const readToken = () => SecureStore.getItemAsync(KEY);
export const saveToken = (token) => SecureStore.setItemAsync(KEY, token);
export const clearToken = () => SecureStore.deleteItemAsync(KEY);
