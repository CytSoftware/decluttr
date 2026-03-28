import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#30B8B0",
          dark: "#28A09A",
        },
        navy: {
          DEFAULT: "#1E5C8A",
          dark: "#174A6E",
        },
        keep: "#10B981",
        close: "#F43F5E",
        surface: "#FFFFFF",
        background: "#EDF4F8",
        border: "#C8DDE8",
        steel: "#5898C0",
        ocean: "#2872A0",
        sky: "#C8DDE8",
        "text-primary": "#1A2A3A",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",
      },
      borderRadius: {
        card: "1rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
    },
  },
};

export default config;
