import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: "#0A0F1F",
        panel: "#111827",
        primary: "#2563EB",
        neon: "#38BDF8",
        ai: "#7C3AED",
        "ai-soft": "#A78BFA",
        data: "#10B981",
        "data-soft": "#34D399",
        text: "#F8FAFC",
        soft: "#CBD5E1",
        muted: "#94A3B8",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(56, 189, 248, 0.25)",
        violet: "0 0 48px rgba(124, 58, 237, 0.28)",
      },
      backgroundImage: {
        "grid-tech":
          "linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
