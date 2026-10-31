/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090a0f",
        card: "#11131c",
        cardBorder: "#1e2235",
        accent: {
          cyan: "#00f2fe",
          indigo: "#4facfe",
          purple: "#7f5af0",
          emerald: "#2cb67d",
          rose: "#ff5470",
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      }
    },
  },
  plugins: [],
}
