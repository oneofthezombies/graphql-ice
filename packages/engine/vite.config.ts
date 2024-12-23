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
    minify: true,
    rollupOptions: {
      plugins: [
        deletePlugin({ targets: "dist/*", runOnce: true }),
        copy({
          targets: [
            {
              src: "src/core.wasm.d.ts",
              dest: "dist",
            },
          ],
          hook: "writeBundle",
        }),
      ],
      preserveEntrySignatures: "exports-only",
      input: [
        "./src/index.ts",
        "./src/adapter/cloudflare-workers.ts",
        "./src/adapter/deno-deploy.ts",
        "./src/adapter/node.ts",
        "./src/adapter/vercel-functions-edge.ts",
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        dir: "dist",
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name][extname]",
      },
      external: ["node:fs", "node:path", "node:url", "wbg"],
    },
  },
});
