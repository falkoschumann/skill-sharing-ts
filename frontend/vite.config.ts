// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

/// <reference types="vitest" />
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: process.env.DEV_PORT ? parseInt(process.env.DEV_PORT) : 3000,
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.SERVER_PORT ?? 8080}`,
      },
    },
  },
});
