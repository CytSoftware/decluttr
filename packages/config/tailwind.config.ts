import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
        },
        keep: "#10B981",
        close: "#F43F5E",
        surface: "#FFFFFF",
        background: "#FAFBFC",
        border: "#E5E7EB",
        "text-primary": "#111827",
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
