// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config")
const expoConfig = require("eslint-config-expo/flat")
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended")
const tsParser = require("@typescript-eslint/parser")

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*", "builds/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "*.d.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
])
