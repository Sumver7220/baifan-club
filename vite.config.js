import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
});
