import { execFileSync } from 'node:child_process';

const backendUrl = process.env.VITE_API_URL;

if (!backendUrl) {
  throw new Error('VITE_API_URL is not defined in .env');
}

const schemaUrl = `${backendUrl.replace(/\/+$/, '')}/openapi.json`;

execFileSync(
  'pnpm exec',
  ['openapi-typescript', schemaUrl, '--output', 'src/api/generated/schema.ts'],
  {
    stdio: 'inherit',
    shell: true,
  }
);
