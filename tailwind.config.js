/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "./src/app/**/*.{js,ts,jsx,tsx}",
    // "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#F97316",
        bg: "#F3F4F6",
        surface: "#FFFFFF",
        error: "#EF4444",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        xl: "1.5rem",
      },
      spacing: { 7: "1.75rem", 9: "2.25rem" },
      fontSize: {
        xl2: ["1.75rem", { lineHeight: "2rem" }],
        sm2: ["0.8125rem", { lineHeight: "1.25rem" }],
      },
    },
  },
  plugins: [],
};
