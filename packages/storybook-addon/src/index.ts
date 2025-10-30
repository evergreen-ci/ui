import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { addons, previewHead, stories } from "./main/index";

export const previewAnnotations: StorybookConfig["previewAnnotations"] = [
  join(__dirname, "./preview/index.tsx"),
];
