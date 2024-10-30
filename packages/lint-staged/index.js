export default {
  "**/*.{js,ts,tsx,graphql,gql}": ["yarn prettier"],
  // "*.{ts,tsx}": () => ["yarn check-types"], // For TypeScript files, run tsc, and gql schema check
};
