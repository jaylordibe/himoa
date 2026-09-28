import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';

// Configuration is read from .env in the working directory, which is the
// deployment root on the production host.
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const match = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (match) process.env[match[1]] ??= match[2];
  }
}

const catalogue = existsSync(process.env.CATALOGUE_PATH ?? '')
  ? JSON.parse(readFileSync(process.env.CATALOGUE_PATH, 'utf8'))
  : [];

export function handle(request, response) {
  if (request.method === 'GET' && request.url === '/api/products') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(catalogue));
    return;
  }
  response.writeHead(404).end();
}

if (process.argv[1]?.endsWith('server.js')) {
  createServer(handle).listen(Number(process.env.PORT ?? 8080));
}
