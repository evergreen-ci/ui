/**
 * Export point for projectAnnotations.
 * This is a .ts file (not .tsx) to avoid esbuild parsing issues during Storybook preset loading.
 * For snapshot tests, import from this file instead of the .tsx file directly.
 */
export { default as projectAnnotations } from "./preview/index.tsx";
