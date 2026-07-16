import { defineConfig } from "eslint/config";
import baseConfig, { ERROR } from "@evg-ui/eslint-config";

export default defineConfig(
  ...baseConfig,
  // ESLint (@eslint/js) overrides for Parsley.
  {
    files: ["src/**/*.ts?(x)"],
    name: "@eslint/js/parsley-overrides",
    rules: {
      "sort-imports": [ERROR, { ignoreDeclarationSort: true }],
    },
  },
);
