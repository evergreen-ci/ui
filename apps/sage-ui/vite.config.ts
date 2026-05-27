import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const viteConfig = defineConfig({
  server: {
    port: 5493,
  },
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
});

export default viteConfig;
