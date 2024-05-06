const baseConfig = require("../../lint-staged.base.config");

module.exports = {
  ...baseConfig,
  "*.{ts,tsx}": () => ["yarn check-types", "yarn check-schema-and-codegen"], // For TypeScript files, run tsc, and gql schema check
};
