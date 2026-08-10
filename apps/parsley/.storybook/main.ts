import type { StorybookConfig } from "@storybook/react-vite";
import wyw from "@wyw-in-js/vite";
import { linariaOptions } from "./linaria.config.ts";

const viteFinal: StorybookConfig["viteFinal"] = (config) => {
  config.plugins = config.plugins ?? [];
  config.plugins.unshift(wyw(linariaOptions));
  return config;
};

export default {
  addons: ["@evg-ui/storybook-addon"],
  framework: {
    name: "@storybook/react-vite",
  },
  viteFinal,
} satisfies StorybookConfig;
