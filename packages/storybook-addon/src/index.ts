import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { addons, previewHead, stories } from "./main/index.ts";

// Note: projectAnnotations is exported from "./preview.ts" for use in snapshot tests.
// We don't export it here to avoid Storybook trying to parse JSX during preset loading.
// Import it directly: import { projectAnnotations } from "@evg-ui/storybook-addon/preview"

export const previewAnnotations: StorybookConfig["previewAnnotations"] = [
  // Use ESM-compatible path resolution - Storybook will handle .tsx files correctly
  resolve(__dirname, "./preview/index.tsx").replace(/\\/g, "/"),
];
