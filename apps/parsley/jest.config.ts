import type { Config } from "jest";

const config: Config = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/src/{main.tsx,vite-env.d.ts}",
  ],
  displayName: "parsley",
  moduleFileExtensions: ["tsx", "ts", "json", "js", "jsx"],
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
  },
  modulePaths: ["<rootDir>/src"],
  preset: "ts-jest/presets/js-with-ts",
  resetMocks: true,
  setupFiles: ["./config/jest/vi.setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.ts"],
  snapshotSerializers: ["@emotion/jest/serializer"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/{src,scripts}/**/*.{spec,test}.{ts,tsx}"],
  transform: {
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json|graphql)$)":
      "<rootDir>/config/jest/svgTransform.js",
    "^.+\\.[tj]sx?$": ["ts-jest", { isolatedModules: true }],
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^.+\\.graphql$": "@graphql-tools/jest-transform",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${[
      // jest doesn't officially support ESM so ignore ansi_up: https://jestjs.io/docs/ecmascript-modules
      "ansi_up",
      // The following modules are all related to the query-string package.
      "query-string",
      "decode-uri-component",
      "split-on-first",
      "filter-obj",
    ].join("|")})`,
  ],
};

export default config;
