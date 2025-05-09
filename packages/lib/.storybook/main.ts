import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default {
  addons: ["@evg-ui/storybook-addon"],
  framework: {
    name: "@storybook/react-vite",
  },
  // Specify some Vite config since @evg-ui/lib has no vite.config.ts
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()],
      define: {
        "process.env": {},
      },
      resolve: {
        alias: {
          "@leafygreen-ui/emotion": resolve(
            __dirname,
            "../config/leafygreen-ui/emotion",
          ),
        },
        extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
      },
    });
  },
};
