const ERROR = "error";
const WARN = "warn";
const OFF = "off";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

module.exports = {
  root: true,
  extends: ["@evg-ui"],
  plugins: ["check-file"],
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
    "react/display-name": OFF,
    "react/no-unstable-nested-components": OFF, // This rule should be removed as part of EVG-17265.
    "react/sort-comp": [
      errorIfStrict,
      { order: ["everything-else", "render"] },
    ],
  },
};
