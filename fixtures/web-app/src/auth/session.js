import { postJson } from '../api/client';

// The server sets an HttpOnly session cookie on success. Nothing about the
// session is stored in the client.
export async function signIn(email, password) {
  return postJson('/api/session', { email, password });
}
