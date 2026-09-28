// Added after the security audit: configuration and repository metadata must
// never be downloadable.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { handle } from '../src/server.js';

async function get(path) {
  const server = createServer(handle).listen(0);
  const { port } = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`);
    return response.status;
  } finally {
    server.close();
  }
}

test('.env is not downloadable', async () => {
  assert.equal(await get('/.env'), 404);
});

test('.git/config is not downloadable', async () => {
  assert.equal(await get('/.git/config'), 404);
});
