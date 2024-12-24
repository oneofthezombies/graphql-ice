import { defineConfig } from "vite";
import deletePlugin from "rollup-plugin-delete";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import typescript from "vite-plugin-typescript";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ],
  build: {
    target: "esnext",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      plugins: [
        deletePlugin({ targets: "dist/*", runOnce: true }),
        copy({
          targets: [
            {
              src: "src/generated/*.wasm",
              dest: "dist/generated",
            },
            {
              src: "src/generated/*.wasm.d.ts",
              dest: "dist/generated",
            },
          ],
          hook: "writeBundle",
        }),
      ],
      preserveEntrySignatures: "exports-only",
      input: ["./src/index.ts"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        dir: "dist",
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name][extname]",
      },
      external: ["node:fs", "node:path", "node:url"],
    },
  },
});
