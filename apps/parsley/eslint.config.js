import { defineConfig } from "eslint/config";
import baseConfig, { ERROR } from "@evg-ui/eslint-config";

export default defineConfig(
  ...baseConfig,
  // ESLint (@eslint/js) overrides for Parsley.
  {
    name: "@eslint/js/parsley-overrides",
    files: ["src/**/*.ts?(x)"],
    rules: {
      "sort-imports": [ERROR, { ignoreDeclarationSort: true }],
    },
  },
);
