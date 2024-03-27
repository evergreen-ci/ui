import type { Config } from "jest";

const config: Config = {
  coverageReporters: ["text"],
  projects: ["<rootDir>/apps/*"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "bin/jest",
        outputName: "junit.xml",
      },
    ],
  ],
  testTimeout: 30000,
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};

export default config;
