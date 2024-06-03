module.exports = {
  "**/*.{js,ts,tsx}": ["yarn eslint:staged", "yarn prettier"],
  "*.{ts,tsx}": () => ["yarn check-types"], // For TypeScript files, run tsc, and gql schema check
};
