import { defineConfig } from "vitest/config";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [wasm()],
  build: {
    rollupOptions: {
      external: ["wbg"],
    },
  },
  test: {
    environment: "node",
  },
});
