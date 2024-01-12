import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
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
