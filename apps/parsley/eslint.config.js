import { fixupPluginRules } from "@eslint/compat";
import { defineConfig } from "eslint/config";
import * as sortKeysPlugin from "eslint-plugin-sort-keys-plus";
import baseConfig, { ERROR, errorIfStrict } from "@evg-ui/eslint-config";

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
  // Sort Keys File ESLint (eslint-plugin-sort-keys-plus) settings.
  // TODO DEVPROD-6890: This plugin should be dropped because the project has been abandoned.
  // It may potentially be replaced by Perfectionist's sort-objects rule (https://perfectionist.dev/rules/sort-objects).
  {
    name: "sort-keys-plus/rules",
    files: ["src/**/*.ts?(x)"],
    plugins: {
      "sort-keys-plus": fixupPluginRules(sortKeysPlugin),
    },
    rules: {
      "sort-keys-plus/sort-keys": [
        errorIfStrict,
        "asc",
        { allowLineSeparatedGroups: true, natural: true },
      ],
    },
  },
);
