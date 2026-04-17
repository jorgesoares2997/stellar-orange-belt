import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        brand: {
          orange: "#ff8c00",
          amber: "#fbbf24",
          obsidian: "#020617",
          slate: "#1e293b",
        },
      },
      keyframes: {
        grow: {
          from: { width: "0%" },
          to: { width: "var(--target-width)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        grow: "grow 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
