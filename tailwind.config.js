/** @type {import('tailwindcss').Config} */
const colors = import("@mui/material/colors");
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fantasy: ["Fantasy", "cursive"],
      },
      colors: {
        ...colors,
        dark: {
          900: "#171717",
          800: "#262626",
        },
        light: {
          100: "#ffffff",
          200: "#F5F5F5",
          300: "#E5E5E5",
          500: "#D4D4D4",
        },
      },
    },
  },
  plugins: [],
};
