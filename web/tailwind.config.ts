import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      colors: {
        gold: {
          DEFAULT: "#F4A300",
          50: "#FFF8EC",
          100: "#FCEBC2",
          200: "#F9D584",
          300: "#F6BF45",
          400: "#F4A300",
          500: "#D88E00",
          600: "#B07300",
          700: "#7A5000",
        },
        saffron: {
          DEFAULT: "#E07A00",
          600: "#B86200",
          700: "#8C4A00",
        },
        cream: {
          DEFAULT: "#FFF4E5",
          50: "#FFFBF5",
          100: "#FCEFD8",
          200: "#F8E4BD",
        },
        leaf: {
          DEFAULT: "#2E7D32",
          600: "#256628",
          700: "#1F4F22",
          800: "#143515",
        },
        charcoal: {
          DEFAULT: "#2B2B2B",
          700: "#1F1F1F",
          900: "#141414",
        },
      },
      boxShadow: {
        e1: "0 1px 2px rgba(31,16,0,0.06), 0 2px 6px rgba(31,16,0,0.04)",
        e2: "0 4px 10px rgba(31,16,0,0.06), 0 10px 24px rgba(31,16,0,0.06)",
        e3: "0 12px 24px rgba(31,16,0,0.08), 0 24px 48px rgba(31,16,0,0.08)",
        e4: "0 20px 40px rgba(31,16,0,0.12), 0 40px 80px rgba(31,16,0,0.14)",
        soft: "0 8px 30px rgba(43,43,43,0.08)",
        glow: "0 14px 40px rgba(244,163,0,0.32)",
        "glow-lg": "0 24px 60px rgba(224,122,0,0.35)",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        drip: {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "50%": { transform: "translateY(8px) scale(1.05)", opacity: "1" },
        },
        ctaPulse: {
          "0%, 92%, 100%": {
            boxShadow:
              "0 1px 0 rgba(255,255,255,.5) inset, 0 -2px 0 rgba(122,80,0,.25) inset, 0 14px 32px rgba(244,163,0,.32)",
          },
          "96%": {
            boxShadow:
              "0 1px 0 rgba(255,255,255,.5) inset, 0 -2px 0 rgba(122,80,0,.25) inset, 0 0 0 14px rgba(244,163,0,.08), 0 24px 56px rgba(224,122,0,.46)",
          },
        },
      },
      animation: {
        shine: "shine 5s linear infinite",
        drip: "drip 2.6s ease-in-out infinite",
        "cta-pulse": "ctaPulse 5.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
