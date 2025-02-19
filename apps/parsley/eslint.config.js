import { fixupPluginRules } from "@eslint/compat";
import * as sortKeysPlugin from "eslint-plugin-sort-keys-plus";
import tseslint from "typescript-eslint";
import baseConfig, { ERROR, errorIfStrict } from "@evg-ui/eslint-config";

export default tseslint.config(
  ...baseConfig,
  // ESLint overrides for Parsley.
  {
    name: "@eslint/js/parsley-override",
    files: ["src/**/*.ts?(x)"],
    rules: {
      "sort-imports": [
        ERROR,
        {
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
  // Sort Keys File ESLint (eslint-plugin-sort-keys-plus) settings.
  // TODO DEVPROD-6890: This plugin should be dropped because the project has been abandoned.
  // It may potentially be replaced by Perfectionist's sort-objects rule (https://perfectionist.dev/rules/sort-objects).
  {
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
