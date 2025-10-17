// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globalLintRules from "../../globalLintRules.js";

// https://typescript-eslint.io/users/configs/#recommended
export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Include global rules
  ...globalLintRules,

  // Project local rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Disallow imports of native components from Jazz
      "no-restricted-imports": [
        "error",
        {
          paths: ["jazz-tools/expo", "jazz-tools/react-native"],
          patterns: ["jazz-tools/expo/*", "jazz-tools/react-native/*"],
        },
      ],
    },
  },

  // Disable type checking for JS files like the eslint config
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
);
