import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/preview/live-preview.ts"),
      name: "live-preview",
      fileName: "live-preview",
    },
    outDir: resolve(__dirname, "public/"),
    emptyOutDir: false,
  },
});
