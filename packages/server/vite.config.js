import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [wasm(), dts()],
  build: {
    rollupOptions: {
      input: ["./src/index.ts"],
      external: [/\.wasm$/],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
      treeshake: false,
    },
    target: "esnext",
    minify: false,
  },
});
