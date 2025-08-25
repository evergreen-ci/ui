export default {
  addons: ["@evg-ui/storybook-addon"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "vitest.config.ts",
      },
    },
  },
};
