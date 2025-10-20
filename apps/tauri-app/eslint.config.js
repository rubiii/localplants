// @ts-check

import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import globalLintRules from "../../globalLintRules.js";

// https://typescript-eslint.io/users/configs/#recommended
export default defineConfig(
  globalIgnores(["src-tauri", "dist"]),
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.mjs", "*.d.ts"],
        },
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

  // Disable Type checking for JS files like the eslint config
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
);
