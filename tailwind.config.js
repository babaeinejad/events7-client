/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
