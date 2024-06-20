const baseConfig = require("@evg-ui/lint-staged");

module.exports = {
  ...baseConfig,
  "*.{ts,tsx}": () => ["yarn check-schema-and-codegen"], // For TypeScript files, run gql schema check
};
