import type { StorybookConfig } from "@storybook/react-vite";

// Storybook requires using .ts extensions explicitly for imports.
export { previewHead } from "./preview-head.ts";

export const stories = ["../src/**/*.stories.@(js|jsx|ts|tsx)"];

export const addons: StorybookConfig["addons"] = [
  "@storybook/addon-docs",
  "@storybook/addon-links",
  "storybook-addon-apollo-client",
];
