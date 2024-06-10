import type { StorybookConfig } from "@storybook/react-vite";
export { previewHead } from "./preview-head";

export const stories = ["../src/**/*.stories.@(js|jsx|ts|tsx)"];

export const addons: StorybookConfig["addons"] = [
  "@storybook/addon-essentials",
  "@storybook/addon-interactions",
  "@storybook/addon-links",
  "storybook-addon-apollo-client",
];

export const docs: StorybookConfig["docs"] = {
  autodocs: true,
};
