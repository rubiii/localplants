// @ts-check

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // No semis, less noise
      semi: ["error", "never", { beforeStatementContinuationChars: "always" }],

      // Consistent type imports
      // Force marking type imports as such.
      // https://typescript-eslint.io/rules/consistent-type-imports/
      "@typescript-eslint/consistent-type-imports": "error",

      // No unused vars
      // Fix false positives and set to only warn.
      // https://typescript-eslint.io/rules/no-unused-vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
