/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Cyberpunk Green Theme - works in both light and dark
        neon: {
          green: "#00ff88",
          lime: "#39ff14",
          cyan: "#00ffff",
          dark: "#00cc6a",
        },
        cyber: {
          darker: "#050a0a",
          dark: "#0a1414",
          card: "#0f1a1a",
          border: "#1a2828",
          glow: "rgba(0, 255, 136, 0.15)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "neon-green": "0 0 20px rgba(0, 255, 136, 0.4)",
        "neon-green-lg": "0 0 30px rgba(0, 255, 136, 0.5)",
        "neon-cyan": "0 0 20px rgba(0, 255, 255, 0.3)",
        "glass-sm": "0 2px 8px rgba(0, 0, 0, 0.1)",
        "glass-md": "0 4px 16px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
