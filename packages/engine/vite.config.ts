import { defineConfig } from "vite";
import deletePlugin from "rollup-plugin-delete";
import typescript from "vite-plugin-typescript";

const isTest = process.env.NODE_ENV === "test";

export default defineConfig({
  plugins: [
    !isTest && deletePlugin({ targets: "dist/*", runOnce: true }),
    typescript({
      tsconfig: !isTest ? "tsconfig.build.json" : "tsconfig.json",
    }),
  ].filter(Boolean),
  build: {
    target: "esnext",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      input: [
        "./src/index-default.ts",
        "./src/index-node.ts",
        "./src/index-deno.ts",
        "./src/index-browser.ts",
        "./src/index-worker.ts",
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
      external: ["node:fs", "node:path", "node:url", /.*\.\/gen\/.+\.js/],
    },
  },
});
