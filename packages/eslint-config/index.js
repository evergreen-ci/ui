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
    "plugin:import/typescript",
    "plugin:jsdoc/recommended-typescript-error",
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
        "@emotion",
        "sort-destructure-keys"
      ],
      extends: [
        "plugin:jsx-a11y/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
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
        "jsx-a11y/no-autofocus": [ERROR, { ignoreNonDOM: true }],

        "react/button-has-type": ERROR,
        "react/function-component-definition": [
          errorIfStrict,
          {
            namedComponents: "arrow-function",
          },
        ],
        "react/jsx-boolean-value": [ERROR, "never", { always: [] }],
        "react/jsx-curly-brace-presence": [ERROR, { props: "never", children: "never" }],
        "react/jsx-no-constructed-context-values": ERROR,
        "react/jsx-no-useless-fragment": ERROR,
        // Sort props alphabetically except for "key" and "ref", which should come first.
        "react/jsx-sort-props": [ERROR, {
          ignoreCase: true,
          reservedFirst: ["key", "ref"],
        }],
        "react/no-unknown-property": [ERROR, { ignore: ["css"] }],
        "react/no-unstable-nested-components": ERROR,
        "react/prop-types": OFF,
        "react/self-closing-comp": ERROR,
        "react/style-prop-object": ERROR,

        "react-hooks/exhaustive-deps": WARN,
        "react-hooks/rules-of-hooks": ERROR,

        "sort-destructure-keys/sort-destructure-keys": [
          errorIfStrict,
          { caseSensitive: true },
        ],
      },
    },
    // For test files
    {
      extends: ["plugin:testing-library/react"],
      files: ["src/**/*.test.ts?(x)"],
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
        "spaced-comment": OFF,

        // The following two rules are disabled because Spruce and Parsley could have
        // identical fragment and operation names.
        "@graphql-eslint/unique-fragment-name": OFF,
        "@graphql-eslint/unique-operation-name": OFF
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
    "array-callback-return": [ERROR, { allowImplicit: true}],
    "arrow-body-style": [
      errorIfStrict,
      "as-needed",
      {
        requireReturnForObjectLiteral: false,
      },
    ],
    camelcase: [ERROR, { properties: "never", ignoreDestructuring: false }],
    "consistent-return": OFF,
    curly: [errorIfStrict, "multi-line"],
    "default-case": ERROR,
    "default-param-last": ERROR,
    "dot-notation": [ERROR, { allowKeywords: true }],
    eqeqeq: [errorIfStrict, "always", { null: "ignore" }],
    "no-console": OFF,
    "no-debugger": errorIfStrict,
    "no-else-return": ERROR,
    "no-empty": [ERROR, { allowEmptyCatch: true }],
    "no-lonely-if": ERROR,
    "no-nested-ternary": ERROR,
    "no-new-wrappers": ERROR,
    "no-path-concat": ERROR,
    "no-plusplus": [ERROR, { allowForLoopAfterthoughts: true }],
    "no-return-await": ERROR,
    "no-shadow": OFF, // Disabled for @typescript-eslint/no-shadow
    "no-undef": OFF, // TypeScript makes this rule irrelevant
    "no-undef-init": ERROR,
    "no-unneeded-ternary": ERROR,
    "no-unreachable-loop": ERROR,
    "no-unused-vars": OFF, // Disabled for @typescript-eslint/no-unused-vars
    "no-use-before-define": OFF, // Disabled for @typescript-eslint/no-use-before-define
    "no-useless-concat": ERROR,
    "no-var": ERROR,
    "operator-assignment": [ERROR, "always"],
    "prefer-const": [ERROR, { destructuring: "all" }],
    "prefer-destructuring": [ERROR, {
      VariableDeclarator: {
        array: false,
        object: true,
      },
      AssignmentExpression: {
        array: true,
        object: false,
      },
    }, { enforceForRenamedProperties: false }],
    "prefer-regex-literals": [ERROR, { disallowRedundantWrapping: true }],
    "prefer-template": ERROR,
    radix: ERROR,
    yoda: ERROR,

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
    "import/first": ERROR,
    "import/newline-after-import": WARN,
    "import/no-dynamic-require": ERROR,
    "import/no-duplicates": [ERROR, { "prefer-inline": true }],
    "import/no-extraneous-dependencies": OFF,
    "import/no-unresolved": OFF,
    "import/no-useless-path-segments": ERROR,
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
      typescript: true,
      node: true,
    },
    "import/ignore": ["node_modules"],
    react: {
      version: "detect",
    },
  },
};
