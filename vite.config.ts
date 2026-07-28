import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    server: {
      host: env.VITE_DEV_HOST,
      port: env.VITE_DEV_PORT ? Number(env.VITE_DEV_PORT) : undefined,
    },
  };
});
