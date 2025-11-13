import checkFilePlugin from "eslint-plugin-check-file";
import tseslint from "typescript-eslint";
import baseConfig, { WARN, OFF, errorIfStrict } from "@evg-ui/eslint-config";

export default tseslint.config(
  ...baseConfig,
  // Check File ESLint (eslint-plugin-check-file) settings.
  {
    name: "check-file/rules",
    files: ["src/**/*.ts?(x)"],
    plugins: {
      "check-file": checkFilePlugin,
    },
    rules: {
      "check-file/filename-naming-convention": [
        errorIfStrict,
        {
          // GraphQL fragments, mutations and queries
          "src/gql/fragments/**/*.graphql": "CAMEL_CASE",
          "src/gql/(mutations,queries)/**/*.graphql": "KEBAB_CASE",
          // Cypress
          "cypress/integration/**/*.ts": "SNAKE_CASE",
          // Scripts
          "scripts/**/*.{js,ts}": "KEBAB_CASE",
          // JS and TS with exceptions
          "src/(!test_utils)/**/!(vite-env.d)*.{js,ts}": "CAMEL_CASE",
          // All tsx with exceptions
          "src/!(test_utils)/**/!(use|getFormSchema|index|test-utils|schemaFields|getColumnsTemplate|githubPRLinkify|jiraLinkify)*.tsx":
            "PASCAL_CASE",
          // Test utils
          "src/test_utils/**/*": "KEBAB_CASE",
          // tsx exceptions
          "src/**/(use|getFormSchema|index)*.tsx": "CAMEL_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  // React ESLint (eslint-plugin-react) overrides for Spruce.
  {
    name: "react/spruce-overrides",
    files: ["src/**/*.ts?(x)"],
    rules: {
      "react/display-name": WARN,
      "react/no-unstable-nested-components": OFF, // This rule should be removed as part of EVG-17265.
      "@typescript-eslint/no-explicit-any": WARN,
    },
  },
);
