import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
  addons: ["@evg-ui/storybook-addon"],
  framework: {
    name: "@storybook/react-vite",
  },
  // Specify some Vite config since @evg-ui/lib has no vite.config.ts
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      plugins: [
        tsconfigPaths(),
        {
          react: {
            jsxImportSource: "@emotion/react",
          }
        }
      ],
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
