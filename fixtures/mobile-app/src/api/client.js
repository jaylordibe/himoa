import { readToken } from '../auth/token';

const BASE_URL = 'https://api.example.invalid';

async function request(path, options = {}) {
  const token = await readToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with ${response.status}`);
  }
  return response.json();
}

export const getJson = (path) => request(path);
export const postJson = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
