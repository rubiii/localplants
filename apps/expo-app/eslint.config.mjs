// @ts-check

import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";
import globalLintRules from "../../globalLintRules.js";

// https://typescript-eslint.io/users/configs/#recommended
export default defineConfig(
  globalIgnores(["dist", "builds"]),
  expoConfig,
  eslint.configs.recommended,

  // Include global rules
  ...globalLintRules,
);
