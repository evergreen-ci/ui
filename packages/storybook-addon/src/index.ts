import type { StorybookConfig } from "@storybook/react-vite";

export { addons, previewHead, stories } from "./main/index.js";

export { default as projectAnnotations } from "./preview/index.js";

export const previewAnnotations: StorybookConfig["previewAnnotations"] = [
  // Cannot reference module (i.e. require("./preview")) due to Vitest setup.
  // https://github.com/vitest-dev/vitest/issues/846
  require.resolve("./preview/index.tsx"),
];
