export async function getJson(path) {
  const response = await fetch(path, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with ${response.status}`);
  }
  return response.json();
}

export async function postJson(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with ${response.status}`);
  }
  return response.json();
}
