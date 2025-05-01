// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import * as path from "node:path";
import * as url from "node:url";
import dts from "vite-plugin-dts";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        domain: path.resolve(__dirname, "src/domain/index.ts"),
        util: path.resolve(__dirname, "src/util/index.ts"),
      },
      //formats: ["es"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["class-transformer", "class-validator"],
    },
  },
  plugins: [dts({ rollupTypes: true }), swc.vite({ module: { type: "es6" } })],
});
