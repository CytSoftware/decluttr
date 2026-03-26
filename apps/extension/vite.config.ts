import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";
import path from "path";

const browser = process.env.BROWSER ?? "chrome";

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: "manifest.json",
      browser,
      additionalInputs: ["src/newtab/index.html", "src/saved/index.html", "src/popup/index.html"],
      disableAutoLaunch: true,
    }),
  ],
  build: {
    outDir: `dist/${browser}`,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
