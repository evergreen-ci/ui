import type { Config } from "jest";

const config: Config = {
  displayName: "parsley",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/src/{main.tsx,vite-env.d.ts}",
  ],
  moduleFileExtensions: ["tsx", "ts", "json", "js", "jsx"],
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
  },
  modulePaths: ["<rootDir>/src"],
  setupFiles: ["./config/jest/jest.setup.ts"],
  preset: "ts-jest/presets/js-with-ts",
  resetMocks: true,
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.ts"],
  snapshotSerializers: ["@emotion/jest/serializer"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/{src,scripts}/**/*.{spec,test}.{ts,tsx}"],
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", { isolatedModules: true }],
    "^.+\\.graphql$": "@graphql-tools/jest-transform",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/svgTransform.js",
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
