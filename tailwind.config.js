/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        sm: "4px",
        DEFAULT: "12px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      colors: {
        orange: {
          300: "#fed7aa",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        blue: {
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
        green: {
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        purple: {
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
        },
      },
    },
  },
  plugins: [],
};
