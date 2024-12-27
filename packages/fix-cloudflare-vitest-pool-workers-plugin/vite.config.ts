import { defineConfig, Plugin } from "vite";
import deletePlugin from "rollup-plugin-delete";
import typescript from "vite-plugin-typescript";
import copy from "rollup-plugin-copy";

const isTest = process.env.MODE === "test";

export default defineConfig({
  plugins: [
    isTest && deletePlugin({ targets: "dist/*", runOnce: true }),
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ].filter(Boolean),
  build: {
    target: "esnext",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      input: ["./src/index.ts"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        dir: "dist",
        format: "es",
        entryFileNames: "[name].js",
      },
      external: ["node:path"],
    },
  },
});
