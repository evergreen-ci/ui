module.exports = {
  "**/*.{js,ts,tsx}": ["yarn eslint:staged", "yarn prettier"],
  "src/gql/**/*.{graphql,gql}": [
    "yarn eslint:staged",
    "yarn prettier --parser graphql",
  ], // For GraphQL files, run eslint and prettier, and gql schema check
  "*.{ts,tsx}": () => ["yarn check-types"], // For TypeScript files, run tsc, and gql schema check
};
