// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import js from "@eslint/js";
import globals from "globals";
import headers from "eslint-plugin-headers";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import ts from "typescript-eslint";

export default ts.config(
  {
    ignores: ["**/build", "**/coverage", "**/dist"],
  },
  {
    extends: [js.configs.recommended, ...ts.configs.recommended],
    files: ["*.cjs", "*.mjs", "*.js", "*.jsx", "*.ts", "*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      headers,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "headers/header-format": [
        "error",
        {
          source: "string",
          style: "line",
          trailingNewlines: 2,
          content: `Copyright (c) ${new Date().getUTCFullYear()} Falko Schumann. All rights reserved. MIT license.`,
        },
      ],
    },
  },
);
