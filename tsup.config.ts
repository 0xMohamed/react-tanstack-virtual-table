import { defineConfig } from "tsup";
import postcss from "rollup-plugin-postcss";
import type { Plugin } from "esbuild";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  bundle: true,
  minify: true,
  // injectStyle: true,
  plugins: [
    postcss({
      inject: true,
      minimize: true,
    }) as unknown as Plugin,
  ],
  external: ["react", "react-dom"],
});
