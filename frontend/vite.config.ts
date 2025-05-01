// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.DEV_PORT ? parseInt(process.env.DEV_PORT) : 3000,
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.SERVER_PORT ?? 8080}`,
      },
    },
  },
});
