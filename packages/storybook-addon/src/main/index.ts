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
 *
 * Also target a modern CSS engine and skip CSS minification. Via design tokens
 * use the CSS `light-dark()` function; Storybook's default production CSS
 * pipeline lowers it away, collapsing token values into invalid concatenated
 * colors (borders/backgrounds silently vanish in Chromatic). The evergreen
 * Chromatic browser supports `light-dark()` natively.
 * @internal
 */
export const viteFinal: StorybookConfig["viteFinal"] = (config) => {
  config.resolve = config.resolve ?? {};
  config.resolve.alias = {
    ...config.resolve.alias,
    "@emotion/server": "@emotion/css",
  };
  config.build = {
    ...config.build,
    cssTarget: "chrome123",
    cssMinify: false,
  };
  return config;
};
