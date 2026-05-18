export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A0F1C", card: "#1A2235", secondary: "#111827" },
        teal: { DEFAULT: "#00D4C8", dark: "#00A89E" },
        danger: "#FF4D6D",
        success: "#06D6A0",
        warning: "#FFB830",
        border: "#2A3548",
      },
      fontFamily: {
        heading: ["Manrope", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
