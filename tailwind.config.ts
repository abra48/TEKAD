import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#08090a",
          50: "#0c0d0f",
          100: "#111214",
          200: "#16181a",
          300: "#1e2023",
          400: "#25272b",
        },
      },
      animation: {
        "shimmer": "shimmer 2s infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow": "0 0 20px rgba(59, 130, 246, 0.1), 0 0 60px rgba(59, 130, 246, 0.05)",
        "glow-md": "0 0 30px rgba(59, 130, 246, 0.15), 0 0 80px rgba(59, 130, 246, 0.08)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.2), 0 0 100px rgba(59, 130, 246, 0.1)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
