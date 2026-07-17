import eslint from "@eslint/js";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import stylisticPlugin from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";
import disableConflictsPlugin from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsdocPlugin from "eslint-plugin-jsdoc";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import playwrightPlugin from "eslint-plugin-playwright";
import prettierConfig from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import storybookPlugin from "eslint-plugin-storybook";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const configDir = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = dirname(dirname(configDir));

const ERROR = "error";
// Warnings are discouraged. Their use should be limited to new rules that cannot have all their violations fixed at once.
const WARN = "warn";
const OFF = "off";

const errorIfCI = process.env.CI ? ERROR : OFF;
const errorIfStrict = process.env.STRICT ? ERROR : WARN;

const globalIgnores = {
  ignores: [
    "**/bin",
    "**/build",
    "**/coverage",
    "**/dist",
    "**/public",
    "**/sdlschema",
    "**/gql/generated/types.ts",
    "**/storybook-static",
    "**/routeTree.gen.ts",
  ],
  name: "Globally Ignored Files",
};

const languageOptions = {
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  name: "Language Options",
  settings: {
    react: {
      version: "detect",
    },
  },
};

// ESLint (@eslint/js) settings.
const eslintConfig = {
  files: ["**/*.js?(x)", "**/*.ts?(x)"],
  name: "@eslint/js/rules",
  plugins: {
    "@eslint/js": eslint,
  },
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
    camelcase: [ERROR, { ignoreDestructuring: false, properties: "never" }],
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
        AssignmentExpression: {
          array: true,
          object: false,
        },
        VariableDeclarator: {
          array: false,
          object: true,
        },
      },
      { enforceForRenamedProperties: false },
    ],
    "prefer-regex-literals": [ERROR, { disallowRedundantWrapping: true }],
    "prefer-template": ERROR,
    radix: ERROR,
    yoda: ERROR,
  },
};

// Stylistic (@stylistic/eslint-plugin) settings.
const stylisticConfig = {
  files: ["**/*.js?(x)", "**/*.ts?(x)"],
  name: "@stylistic/rules",
  plugins: {
    "@stylistic": stylisticPlugin,
  },
  rules: {
    ...stylisticPlugin.configs.recommended.rules,
    "@stylistic/spaced-comment": [ERROR, "always", { markers: ["/"] }],
  },
};

// TypeScript ESLint (typescript-eslint) settings.
const tsEslintConfig = {
  files: ["**/*.ts?(x)"],
  ignores: [
    "**/.storybook/**",
    "**/*.config.ts",
    "**/config/**",
    "**/playwright/**",
  ],
  languageOptions: {
    ecmaVersion: "latest",
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      project: [
        resolve(monorepoRoot, "./apps/*/tsconfig.json"),
        resolve(monorepoRoot, "./packages/*/tsconfig.json"),
      ],
      tsConfigRootDir: monorepoRoot,
    },
    sourceType: "module",
  },
  name: "typescript-eslint/rules",
  plugins: {
    "typescript-eslint": tseslint,
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": ERROR,
    "@typescript-eslint/no-deprecated": errorIfCI,
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
        argsIgnorePattern: "^_",
        caughtErrors: "none",
        ignoreRestSiblings: true,
        vars: "all",
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
  files: ["src/**/*.ts?(x)"],
  name: "react/rules",
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
      { children: "never", props: "never" },
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
    "react/no-unstable-nested-components": [
      ERROR,
      {
        // This pattern matches prop names like "itemRenderer", "contentRenderer", etc.
        // It must be written to satisfy glob patterns, not regex.
        propNamePattern: "{*Renderer,itemContent}",
      },
    ],
    "react/prop-types": OFF,
    "react/self-closing-comp": ERROR,
    "react/style-prop-object": ERROR,
  },
};

// React Hooks ESLint (eslint-plugin-react-hooks) settings
const reactHooksConfig = {
  files: ["src/**/*.ts?(x)"],
  name: "react-hooks/rules",
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
  files: ["src/**/*.ts?(x)"],
  name: "jsx-a11y/rules",
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

const perfectionistConfig = {
  files: ["**/*.js?(x)", "**/*.ts?(x)"],
  // In form schema files, we define fields in a specific display order, and we don't want to sort them.
  ignores: [
    "**/getFormSchema.ts?(x)",
    "**/schemaFields.ts?(x)",
    "**/formSchema.ts?(x)",
    "**/*Schema.ts?(x)",
  ],
  name: "perfectionist/rules",
  plugins: {
    perfectionist: perfectionistPlugin,
  },
  rules: {
    "perfectionist/sort-named-imports": [
      ERROR,
      { ignoreCase: false, order: "asc", type: "natural" },
    ],
    "perfectionist/sort-objects": [
      ERROR,
      { ignoreCase: false, order: "asc", type: "natural" },
    ],
  },
};

// React Testing Library ESLint (eslint-plugin-testing-library) settings.
const testingLibraryConfig = {
  ...testingLibraryPlugin.configs["flat/react"],
  files: ["src/**/*.test.ts?(x)"],
  name: "testing-library/rules",
};

// JSDoc ESLint (eslint-plugin-jsdoc) settings.
const jsDocConfig = {
  ...jsdocPlugin.configs["flat/recommended-typescript-error"],
  files: ["**/*.js?(x)", "**/*.ts?(x)"],
  name: "jsdoc/rules",
  settings: {
    jsdoc: {
      ignoreInternal: true,
    },
  },
};

// Storybook ESLint (eslint-plugin-storybook) settings.
const storyBookConfig = {
  files: ["src/**/*.stories.ts?(x)"],
  name: "storybook/rules",
  rules: {
    "storybook/no-stories-of": ERROR,
  },
};

// Playwright ESLint (eslint-plugin-playwright) settings.
const playwrightConfig = {
  files: ["playwright/**/*.ts"],
  name: "playwright/rules",
  plugins: {
    playwright: playwrightPlugin,
  },
  rules: {
    ...playwrightPlugin.configs.recommended.rules,
    "no-await-in-loop": "off",
  },
};

// GraphQL ESLint (@graphql-eslint/eslint-plugin) settings.
// The processor extracts GraphQL from gql tagged template literals in .ts
// files and creates virtual .graphql documents that the rules config applies to.
const graphQLProcessorConfig = {
  files: ["src/gql/**/*.ts"],
  ignores: ["**/*.test.ts", "**/*.test.tsx"],
  name: "@graphql-eslint/processor",
  processor: graphqlPlugin.processor,
};

const graphQLConfig = {
  // Matches virtual .graphql documents extracted by the processor from gql tagged templates.
  files: ["src/gql/**/*.graphql"],
  languageOptions: {
    parser: graphqlPlugin.parser,
  },
  name: "@graphql-eslint/rules",
  plugins: {
    "@graphql-eslint": graphqlPlugin,
  },
  rules: {
    ...graphqlPlugin.configs["flat/operations-recommended"].rules,
    "@graphql-eslint/alphabetize": [
      errorIfStrict,
      {
        groups: ["...", "id", "*"],
        selections: ["OperationDefinition", "FragmentDefinition"],
      },
    ],
    "@graphql-eslint/known-directives": [
      "error",
      { ignoreClientDirectives: ["client"] },
    ],
    "@graphql-eslint/no-deprecated": ERROR,
    "@graphql-eslint/selection-set-depth": [ERROR, { maxDepth: 8 }],

    "@graphql-eslint/unique-fragment-name": OFF,
    // The following two rules are disabled because Spruce and Parsley could have
    // identical fragment and operation names.
    "@graphql-eslint/unique-operation-name": OFF,
  },
};

// Import ESLint (eslint-plugin-import) settings.
const importConfig = {
  ...importPlugin.flatConfigs.recommended,
  ...importPlugin.flatConfigs.typescript,
  name: "import/rules",
  rules: {
    ...importPlugin.flatConfigs.recommended.rules,
    ...importPlugin.flatConfigs.typescript.rules,
    "import/first": ERROR,
    "import/newline-after-import": ERROR,
    "import/no-duplicates": [ERROR, { "prefer-inline": true }],
    "import/no-dynamic-require": ERROR,
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
  settings: {
    "import/ignore": ["node_modules"],
    "import/resolver": {
      node: true,
      typescript: true,
    },
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

export default defineConfig(
  globalIgnores,
  languageOptions,
  eslintConfig,
  stylisticConfig,
  tseslint.configs.recommended,
  tsEslintConfig,
  reactConfig,
  reactHooksConfig,
  jsxA11yConfig,
  perfectionistConfig,
  testingLibraryConfig,
  jsDocConfig,
  storybookPlugin.configs["flat/recommended"],
  storyBookConfig,
  playwrightConfig,
  graphQLProcessorConfig,
  graphQLConfig,
  importConfig,
  disableConflictingPrettierRules,
  // Prettier should be the last plugin.
  prettierEsLintConfig,
);

export { ERROR, WARN, OFF, errorIfStrict };
