import * as emotionPlugin from "@emotion/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import disableConflictsPlugin from "eslint-config-prettier";
import cypressPlugin from "eslint-plugin-cypress/flat";
import importPlugin from "eslint-plugin-import";
import jsdocPlugin from "eslint-plugin-jsdoc";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import sortDestructureKeysPlugin from "eslint-plugin-sort-destructure-keys";
import storybookPlugin from "eslint-plugin-storybook";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

const ERROR = "error";
// Warnings are discouraged. Their use should be limited to new rules that cannot have all their violations fixed at once.
const WARN = "warn";
const OFF = "off";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

const globalIgnores = {
  name: "Globally Ignored Files",
  ignores: [
    "**/bin",
    "**/build",
    "**/coverage",
    "**/dist",
    "**/public",
    "**/sdlschema",
    "**/gql/generated/types.ts",
    "**/storybook-static",
  ],
};

const languageOptions = {
  name: "Language Options",
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

// ESLint (@eslint/js) settings.
const eslintConfig = {
  name: "@eslint/js/rules",
  plugins: {
    "@eslint/js": eslint,
  },
  files: ["**/*.js?(x)", "**/*.ts?(x)"],
  rules: {
    ...eslint.configs.recommended.rules,
    "array-callback-return": [ERROR, { allowImplicit: true }],
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
    "no-await-in-loop": ERROR,
    "no-console": OFF,
    "no-debugger": errorIfStrict,
    "no-else-return": ERROR,
    "no-empty": [ERROR, { allowEmptyCatch: true }],
    "no-lonely-if": ERROR,
    "no-nested-ternary": ERROR,
    "no-new-wrappers": ERROR,
    "no-plusplus": [ERROR, { allowForLoopAfterthoughts: true }],
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
    "prefer-destructuring": [
      ERROR,
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      { enforceForRenamedProperties: false },
    ],
    "prefer-regex-literals": [ERROR, { disallowRedundantWrapping: true }],
    "prefer-template": ERROR,
    radix: ERROR,
    "spaced-comment": [ERROR, "always", { markers: ["/"] }], // TODO: This rule is deprecated - fix in DEVPROD-15014.
    yoda: ERROR,
  },
};

// TypeScript ESLint (typescript-eslint) settings.
const tsEslintConfig = {
  name: "typescript-eslint/rules",
  files: ["**/*.ts?(x)"],
  languageOptions: {
    parser: tseslint.parser,
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
      tsConfigRootDir: import.meta.url,
    },
  },
  plugins: {
    "typescript-eslint": tseslint,
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": ERROR,
    "@typescript-eslint/no-empty-object-type": ERROR,
    "@typescript-eslint/no-explicit-any": ERROR,
    "@typescript-eslint/no-namespace": OFF,

    // Rules for typescript-eslint. Note that these rules extend the ESLint rules. This can cause conflicts, so the original
    // ESLint rules above must be disabled for the following rules to work.
    "@typescript-eslint/no-shadow": ERROR,
    "@typescript-eslint/no-unused-vars": [
      errorIfStrict,
      {
        args: "after-used",
        ignoreRestSiblings: true,
        vars: "all",
        caughtErrors: "none",
      },
    ],
    "@typescript-eslint/no-use-before-define": [
      ERROR,
      { functions: false, variables: false },
    ],
  },
};

// React ESLint (eslint-plugin-react) settings.
const reactConfig = {
  ...reactPlugin.configs.flat.recommended,
  ...reactPlugin.configs.flat["jsx-runtime"], // Need to use this config if using React 17+.
  name: "react/rules",
  files: ["src/**/*.ts?(x)"],
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    ...reactPlugin.configs.flat["jsx-runtime"].rules,
    "react/button-has-type": ERROR,
    "react/function-component-definition": [
      errorIfStrict,
      {
        namedComponents: "arrow-function",
      },
    ],
    "react/jsx-boolean-value": [ERROR, "never", { always: [] }],
    "react/jsx-curly-brace-presence": [
      ERROR,
      { props: "never", children: "never" },
    ],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "react/jsx-no-constructed-context-values": ERROR,
    "react/jsx-no-useless-fragment": ERROR,
    // Sort props alphabetically except for "key" and "ref", which should come first.
    "react/jsx-sort-props": [
      ERROR,
      {
        ignoreCase: true,
        reservedFirst: ["key", "ref"],
      },
    ],
    "react/no-array-index-key": ERROR,
    "react/no-unknown-property": [ERROR, { ignore: ["css"] }],
    "react/no-unstable-nested-components": ERROR,
    "react/prop-types": OFF,
    "react/self-closing-comp": ERROR,
    "react/style-prop-object": ERROR,
  },
};

// React Hooks ESLint (eslint-plugin-react-hooks) settings
const reactHooksConfig = {
  name: "react-hooks/rules",
  files: ["src/**/*.ts?(x)"],
  plugins: {
    "react-hooks": reactHooksPlugin,
  },
  rules: {
    ...reactHooksPlugin.configs.recommended.rules,
    "react-hooks/exhaustive-deps": ERROR,
    "react-hooks/rules-of-hooks": ERROR,
  },
};

// JSX A11y ESLint (eslint-plugin-jsx-a11y) settings.
const jsxA11yConfig = {
  ...jsxA11yPlugin.flatConfigs.recommended,
  name: "jsx-a11y/rules",
  files: ["src/**/*.ts?(x)"],
  rules: {
    ...jsxA11yPlugin.flatConfigs.recommended.rules,
    "jsx-a11y/anchor-is-valid": errorIfStrict,
    "jsx-a11y/aria-props": errorIfStrict,
    "jsx-a11y/aria-role": [errorIfStrict, { ignoreNonDom: false }],
    "jsx-a11y/label-has-associated-control": [
      errorIfStrict,
      { some: ["nesting", "id"] },
    ],
    "jsx-a11y/no-autofocus": ERROR,
  },
};

// Emotion ESLint (@emotion/eslint-plugin) settings.
// Emotion doesn't actually support FlatConfig yet so we're using a conversion utility.
const emotionConfig = {
  name: "@emotion/rules",
  files: ["src/**/*.ts?(x)"],
  plugins: {
    "@emotion": fixupPluginRules(emotionPlugin),
  },
  rules: {
    "@emotion/import-from-emotion": ERROR,
    "@emotion/no-vanilla": errorIfStrict,
    "@emotion/pkg-renaming": ERROR,
    "@emotion/styled-import": ERROR,
    "@emotion/syntax-preference": [errorIfStrict, "string"],
  },
};

// Sort Destructure Keys ESLint (eslint-plugin-sort-destructure-keys) settings.
const sortDestructureKeysConfig = {
  name: "sort-destructure-keys/rules",
  files: ["src/**/*.ts?(x)"],
  plugins: {
    "sort-destructure-keys": sortDestructureKeysPlugin,
  },
  rules: {
    "sort-destructure-keys/sort-destructure-keys": [
      errorIfStrict,
      { caseSensitive: true },
    ],
  },
};

// React Testing Library ESLint (eslint-plugin-testing-library) settings.
const testingLibraryConfig = {
  ...testingLibraryPlugin.configs["flat/react"],
  name: "testing-library/rules",
  files: ["src/**/*.test.ts?(x)"],
};

// JSDoc ESLint (eslint-plugin-jsdoc) settings.
const jsDocConfig = {
  ...jsdocPlugin.configs["flat/recommended-typescript-error"],
  name: "jsdoc/rules",
  files: ["**/*.js?(x)", "**/*.ts?(x)"],
};

// Storybook ESLint (eslint-plugin-storybook) settings.
const storyBookConfig = {
  name: "storybook/rules",
  files: ["src/**/*.stories.ts?(x)"],
  rules: {
    "storybook/no-stories-of": ERROR,
  },
};

// Cypress ESLint (eslint-plugin-cypress) settings.
const cypressConfig = {
  ...cypressPlugin.configs.recommended,
  name: "cypress/rules",
  files: ["cypress/**/*.ts"],
  languageOptions: {
    parserOptions: {
      project: "./apps/*/cypress/tsconfig.json",
    },
  },
  rules: {
    ...cypressPlugin.configs.recommended.rules,
  },
};

// GraphQL ESLint (@graphql-eslint/eslint-plugin) settings.
const graphQLConfig = {
  name: "@graphql-eslint/rules",
  files: ["src/gql/**/*.graphql"],
  languageOptions: {
    parser: graphqlPlugin.parser,
  },
  plugins: {
    "@graphql-eslint": graphqlPlugin,
  },
  rules: {
    ...graphqlPlugin.configs["flat/operations-recommended"].rules,
    "@graphql-eslint/alphabetize": [
      errorIfStrict,
      {
        selections: ["OperationDefinition", "FragmentDefinition"],
        groups: ["...", "id", "*"],
      },
    ],
    "@graphql-eslint/known-directives": [
      "error",
      { ignoreClientDirectives: ["client"] },
    ],
    "@graphql-eslint/no-deprecated": ERROR,
    "@graphql-eslint/selection-set-depth": [ERROR, { maxDepth: 8 }],
    "spaced-comment": OFF,

    // The following two rules are disabled because Spruce and Parsley could have
    // identical fragment and operation names.
    "@graphql-eslint/unique-operation-name": OFF,
    "@graphql-eslint/unique-fragment-name": OFF,
  },
};

// Import ESLint (eslint-plugin-import) settings.
const importConfig = {
  ...importPlugin.flatConfigs.recommended,
  ...importPlugin.flatConfigs.typescript,
  name: "import/rules",
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
    "import/ignore": ["node_modules"],
  },
  rules: {
    ...importPlugin.flatConfigs.recommended.rules,
    ...importPlugin.flatConfigs.typescript.rules,
    "import/first": ERROR,
    "import/newline-after-import": ERROR,
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
        groups: [
          "external",
          "builtin",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
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
  },
};

const disableConflictingPrettierRules = {
  ...disableConflictsPlugin,
  name: "Disable Conflicting Rules for Prettier",
};

// Prettier ESLint (eslint-plugin-prettier) settings.
const prettierEsLintConfig = {
  ...prettierConfig,
  name: "prettier/rules",
  rules: {
    "prettier/prettier": errorIfStrict,
  },
};

export default tseslint.config(
  globalIgnores,
  languageOptions,
  eslintConfig,
  tseslint.configs.recommended,
  tsEslintConfig,
  reactConfig,
  reactHooksConfig,
  jsxA11yConfig,
  emotionConfig,
  sortDestructureKeysConfig,
  testingLibraryConfig,
  jsDocConfig,
  storybookPlugin.configs["flat/recommended"],
  storyBookConfig,
  cypressConfig,
  graphQLConfig,
  importConfig,
  disableConflictingPrettierRules,
  // Prettier should be the last plugin.
  prettierEsLintConfig,
);

export { ERROR, WARN, OFF, errorIfStrict };
