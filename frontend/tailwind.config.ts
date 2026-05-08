import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "IBM Plex Sans", "sans-serif"]
      },
      colors: {
        ink: "#0b1220",
        haze: "#f8fafc",
        accent: "#0f766e",
        highlight: "#ea580c"
      }
    }
  },
  plugins: []
} satisfies Config;
