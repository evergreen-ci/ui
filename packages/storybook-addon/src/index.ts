import type { StorybookConfig } from "@storybook/react-vite";

export { addons, previewHead, stories, viteFinal } from "./main";

export { default as projectAnnotations } from "./preview";

export const previewAnnotations: StorybookConfig["previewAnnotations"] = [
  // Cannot reference module (i.e. require("./preview")) due to Vitest setup.
  // https://github.com/vitest-dev/vitest/issues/846
  require.resolve("./preview/index.tsx"),
];
