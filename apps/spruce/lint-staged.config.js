import baseConfig from "@evg-ui/lint-staged";

export default {
  ...baseConfig,
  "*.{ts,tsx}": () => ["yarn check-schema-and-codegen"], // For TypeScript files, run gql schema check
};
