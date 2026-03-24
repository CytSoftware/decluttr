import type { Config } from "tailwindcss";
import sharedConfig from "@decluttr/config/tailwind";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,html}", "./index.html", "../../packages/ui/src/**/*.{ts,tsx}"],
  presets: [sharedConfig as Config],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
