export default {
  addons: ["@evg-ui/storybook-addon"],
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "vitest.config.ts",
      },
    },
  },
};
