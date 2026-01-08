import { type StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Storybook requires using .ts extensions explicitly for imports.
export { addons, previewHead, stories, viteFinal } from "./main/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const previewAnnotations: StorybookConfig["previewAnnotations"] = [
  join(__dirname, "preview", "index.tsx"),
];
