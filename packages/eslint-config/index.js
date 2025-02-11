const ERROR = "error";
const WARN = "warn";
const OFF = "off";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:jsdoc/recommended-typescript-error",
    // Airbnb includes some helpful rules for ESLint and React that aren't covered by recommended.
    // See https://github.com/airbnb/javascript/tree/master/packages for specific rules.
    "airbnb",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: [
    "bin",
    "build",
    "coverage",
    "dist",
    "public",
    "sdlschema",
    "src/gql/generated/types.ts",
    "storybook-static",
  ],
  overrides: [
    // For React Typescript files in src.
    {
      files: ["src/**/*.ts", "src/**/*.tsx"],
      plugins: [
        "jsx-a11y",
        "react",
        "react-hooks",
        "@emotion",
        "sort-destructure-keys",
      ],
      rules: {
        "@emotion/import-from-emotion": ERROR,
        "@emotion/no-vanilla": errorIfStrict,
        "@emotion/pkg-renaming": ERROR,
        "@emotion/syntax-preference": [errorIfStrict, "string"],
        "jsx-a11y/anchor-is-valid": errorIfStrict,
        "jsx-a11y/aria-props": errorIfStrict,
        "jsx-a11y/aria-role": [errorIfStrict, { ignoreNonDom: false }],
        "jsx-a11y/label-has-associated-control": [
          errorIfStrict,
          { some: ["nesting", "id"] },
        ],
        "react-hooks/exhaustive-deps": WARN,
        "react/no-unknown-property": ["error", { ignore: ["css"] }],
        "react-hooks/rules-of-hooks": ERROR,

        // Disable some Airbnb rules
        "react/destructuring-assignment": OFF,
        "react/function-component-definition": [
          errorIfStrict,
          {
            namedComponents: "arrow-function",
          },
        ],
        "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
        "react/jsx-props-no-spreading": OFF,
        "react/prop-types": OFF,
        "react/react-in-jsx-scope": OFF,
        "react/require-default-props": OFF,

        "sort-destructure-keys/sort-destructure-keys": [
          errorIfStrict,
          { caseSensitive: true },
        ],

        "react/jsx-sort-props": ERROR, // Sort props alphabetically.
      },
    },
    // For test files
    {
      files: ["src/**/*.test.ts?(x)"],
      extends: ["plugin:testing-library/react"],
    },
    // For Storybook files.
    {
      extends: ["plugin:storybook/recommended"],
      files: ["src/**/*.stories.ts", "src/**/*.stories.tsx"],
      rules: {
        "storybook/no-stories-of": ERROR,
      },
    },
    // For Cypress files.
    {
      extends: ["plugin:cypress/recommended"],
      files: ["cypress/**/*.ts"],
      parserOptions: {
        project: "./apps/*/cypress/tsconfig.json",
      },
      rules: {
        "cypress/unsafe-to-chain-command": WARN,
      },
    },
    // For GraphQL files.
    {
      extends: "plugin:@graphql-eslint/operations-recommended",
      files: ["src/gql/**/*.graphql"],
      rules: {
        "@graphql-eslint/alphabetize": [
          ERROR,
          { selections: ["OperationDefinition", "FragmentDefinition"] },
        ],
        "@graphql-eslint/no-deprecated": WARN,
        "@graphql-eslint/selection-set-depth": [WARN, { maxDepth: 8 }],
        // Following rule can possibly be removed after ESLint updates.
        "spaced-comment": OFF,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
    sourceType: "module",
    tsConfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "arrow-body-style": [
      errorIfStrict,
      "as-needed",
      {
        requireReturnForObjectLiteral: false,
      },
    ],
    "consistent-return": OFF,
    curly: [errorIfStrict, "multi-line"],
    eqeqeq: [errorIfStrict, "always", { null: "ignore" }],
    "no-console": OFF,
    "no-debugger": errorIfStrict,
    "no-empty": [ERROR, { allowEmptyCatch: true }],
    "no-plusplus": [ERROR, { allowForLoopAfterthoughts: true }],
    "no-shadow": OFF,
    "no-undef": OFF,
    "no-unused-vars": OFF,
    "no-use-before-define": OFF,

    "@typescript-eslint/no-namespace": OFF,
    "@typescript-eslint/ban-ts-comment": WARN, 
    "@typescript-eslint/no-explicit-any": WARN,
    "@typescript-eslint/no-empty-object-type": WARN,

    // Rules for typescript-eslint. Note that these rules extend the ESLint rules. This can cause conflicts, so the original
    // ESLint rules above must be disabled for the following rules to work.
    "@typescript-eslint/no-shadow": ERROR,
    "@typescript-eslint/no-unused-vars": [
      errorIfStrict,
      {
        args: "after-used",
        ignoreRestSiblings: true,
        vars: "all",
        caughtErrors: "none"
      },
    ],
    "@typescript-eslint/no-use-before-define": [
      ERROR,
      { functions: false, variables: false },
    ],

    // Rules for eslint-plugin-import. These describe rules about file imports.
    "import/extensions": [
      ERROR, // Allow imports without file extensions (airbnb rule)
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/newline-after-import": WARN,
    "import/no-extraneous-dependencies": OFF,
    "import/no-unresolved": OFF,
    "import/order": [
      ERROR,
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        groups: ["external", "builtin", "internal", "parent", "sibling", "index"],
        pathGroups: [
          {
            group: "external",
            pattern: "react",
            position: "before",
          },
          {
            group: "external",
            pattern: "@**",
            position: "before",
          },
          {
            group: "internal",
            pattern: "@evg-ui/**",
            position: "before",
          },
          {
            group: "internal",
            pattern:
              "(analytics|components|constants|context|gql|hoc|hooks|pages|types|utils)/**",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
      },
    ],
    "import/prefer-default-export": OFF,
    "prettier/prettier": errorIfStrict,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        paths: ["src"],
      },
    },
    react: {
      version: "detect",
    },
  },
};
