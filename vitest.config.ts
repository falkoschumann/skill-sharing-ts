// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["**/src/**/*", "**/test/**/*"],
    },
    hookTimeout: 30_000, // 30 seconds
  },
  plugins: [swc.vite()],
});
