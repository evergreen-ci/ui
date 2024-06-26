import baseConfig from "@evg-ui/lint-staged";

export default {
  ...baseConfig,
  "*.{ts,tsx}": () => ["yarn check-types", "yarn check-schema-and-codegen"], // For TypeScript files, run tsc, and gql schema check
};
