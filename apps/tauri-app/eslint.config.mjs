// @ts-check

import eslint from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

// https://typescript-eslint.io/users/configs/#recommended
export default defineConfig(
  globalIgnores(["src-tauri", "dist"], "Ignore Tauri source and dist"),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      // https://typescript-eslint.io/rules/consistent-type-imports/
      "@typescript-eslint/consistent-type-imports": "error",

      // https://typescript-eslint.io/rules/no-unused-vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: ["jazz-tools/expo", "jazz-tools/react-native"],
          patterns: ["jazz-tools/expo/*", "jazz-tools/react-native/*"],
        },
      ],
    },
  }
)
