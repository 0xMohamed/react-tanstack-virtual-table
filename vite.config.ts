import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Vite is only used for the dev server (playground)
  // Library builds are handled by tsup (see tsup.config.ts)
  root: "playground",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    port: 5173,
  },
});
