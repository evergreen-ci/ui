import type { Config } from "jest";

const config: Config = {
  displayName: "spruce",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/src/{index.tsx,react-app-env.d.ts}",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^antd/es/(.*)$": "antd/lib/$1",
  },
  modulePaths: ["<rootDir>/src"],
  resetMocks: true,
  setupFiles: ["react-app-polyfill/jsdom", "jest-canvas-mock"],
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.ts"],
  snapshotSerializers: ["@emotion/jest/serializer"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/{src,scripts}/**/*.{spec,test}.{ts,tsx}"],
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/fileTransform.js",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${[
      // jest doesn't officially support ESM so ignore ansi_up: https://jestjs.io/docs/ecmascript-modules
      "ansi_up",
      "antd",
      // The following modules are all related to the query-string package.
      "query-string",
      "decode-uri-component",
      "split-on-first",
      "filter-obj",
    ].join("|")})`,
  ],
  globalSetup: "<rootDir>/config/jest/global-setup.js",
};

export default config;
