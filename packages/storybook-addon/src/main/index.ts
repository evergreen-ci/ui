import type { StorybookConfig } from "@storybook/react-vite";

// Storybook requires using .ts extensions explicitly for imports.
export { previewHead } from "./preview-head.ts";

export const stories = ["../src/**/*.stories.@(js|jsx|ts|tsx)"];

export const addons: StorybookConfig["addons"] = [
  "@storybook/addon-docs",
  "@storybook/addon-links",
  "storybook-addon-apollo-client",
];

/**
 * Alias @emotion/server to @emotion/css to prevent LeafyGreen's emotion package
 * from pulling in SSR dependencies that use Node.js Buffer.
 * https://jira.mongodb.org/browse/EVG-17077
 * @internal
 */
export const viteFinal: StorybookConfig["viteFinal"] = (config) => {
  config.resolve = config.resolve ?? {};
  config.resolve.alias = {
    ...config.resolve.alias,
    "@emotion/server": "@emotion/css",
  };
  return config;
};
