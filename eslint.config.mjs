// @ts-check

import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

// https://typescript-eslint.io/users/configs/#recommended
export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      // https://typescript-eslint.io/rules/consistent-type-imports/
      "@typescript-eslint/consistent-type-imports": "error",

      // https://typescript-eslint.io/rules/no-unused-vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  }
)
