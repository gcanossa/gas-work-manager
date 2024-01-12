import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [tsconfigPaths(), react(), viteSingleFile()],
  plugins: [tsconfigPaths(), react()],
  build: {
    outDir: "dist/ui/app",
    emptyOutDir: true,
    copyPublicDir: false,
  },
});
