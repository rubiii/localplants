// @ts-check

import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import expoConfig from "eslint-config-expo/flat.js"

// https://typescript-eslint.io/users/configs/#recommended
export default defineConfig(expoConfig, eslint.configs.recommended, {
  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    // https://typescript-eslint.io/rules/consistent-type-imports/
    "@typescript-eslint/consistent-type-imports": "error",

    // https://typescript-eslint.io/rules/no-unused-vars
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
  },
})
