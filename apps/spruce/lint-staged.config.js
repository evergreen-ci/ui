import baseConfig from "@evg-ui/lint-staged";

export default {
  ...baseConfig,
  "*.{ts,tsx}": () => ["pnpm check-schema-and-codegen"], // For TypeScript files, run gql schema check
};
