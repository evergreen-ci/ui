import baseConfig from "@evg-ui/lint-staged";

export default {
  ...baseConfig,
  "*.graphql": () => ["pnpm check-schema-and-codegen"], // Validate schema and regenerate types when GraphQL files change
};
