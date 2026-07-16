import { defineConfig } from "eslint/config";
import checkFilePlugin from "eslint-plugin-check-file";
import baseConfig, { errorIfStrict } from "@evg-ui/eslint-config";

export default defineConfig(
  ...baseConfig,
  // Check File ESLint (eslint-plugin-check-file) settings.
  {
    files: ["src/**/*.ts?(x)"],
    name: "check-file/rules",
    plugins: {
      "check-file": checkFilePlugin,
    },
    rules: {
      "check-file/filename-naming-convention": [
        errorIfStrict,
        {
          // Scripts
          "scripts/**/*.{js,ts}": "KEBAB_CASE",
          // All tsx with exceptions
          "src/!(test_utils)/**/!(use|getFormSchema|index|test-utils|schemaFields|getColumnsTemplate|githubPRLinkify|jiraLinkify)*.tsx":
            "PASCAL_CASE",
          // JS and TS with exceptions
          "src/(!test_utils)/**/!(vite-env.d)*.{js,ts}": "CAMEL_CASE",
          // tsx exceptions
          "src/**/(use|getFormSchema|index)*.tsx": "CAMEL_CASE",
          "src/gql/(mutations,queries)/**/*.graphql": "KEBAB_CASE",
          // GraphQL fragments, mutations and queries
          "src/gql/fragments/**/*.graphql": "CAMEL_CASE",
          // Test utils
          "src/test_utils/**/*": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
);
