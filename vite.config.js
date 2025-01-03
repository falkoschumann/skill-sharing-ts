import process from 'node:process';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
  },
  server: {
    port: process.env.DEV_PORT ?? 8080,
  },
});
