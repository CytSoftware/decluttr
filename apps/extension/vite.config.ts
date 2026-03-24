import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: "manifest.json",
      browser: process.env.BROWSER ?? "chrome",
      additionalInputs: ["src/newtab/index.html"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
