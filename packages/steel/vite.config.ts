import { defineConfig } from "vite";
import deletePlugin from "rollup-plugin-delete";
import typescript from "vite-plugin-typescript";

const isTest = process.env.NODE_ENV === "test";

export default defineConfig({
  plugins: [
    !isTest && deletePlugin({ targets: "dist/*", runOnce: true }),
    typescript({
      tsconfig: "tsconfig.json",
      exclude: !isTest ? [],
    }),
  ].filter(Boolean),
  build: {
    target: "esnext",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      input: ["./src/default.ts", "./src/node.ts"],
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
