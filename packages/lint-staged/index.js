export default {
  "**/*.{js,ts,tsx,graphql,gql}": ["pnpm prettier"],
  //"*.{ts,tsx}": () => ["pnpm check-types"], // For TypeScript files, run tsc, and gql schema check
};
