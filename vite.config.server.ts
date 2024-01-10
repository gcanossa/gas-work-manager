import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { gasApp } from "@gcanossa/gas-app/dist/vite-gas-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), gasApp()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "server/index.ts",
      output: {
        entryFileNames: "code.js",
      },
      treeshake: false,
    },
    minify: false,
    target: "es2020",
    emptyOutDir: false,
    copyPublicDir: false,
  },
});
