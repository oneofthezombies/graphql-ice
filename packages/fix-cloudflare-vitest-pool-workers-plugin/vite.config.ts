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
