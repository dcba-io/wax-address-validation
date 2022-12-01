/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      lato: ["Lato"]
    },
    extend: {},
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "white-gray": "#F7FAFC",
      "light-gray": "#cdd2d8",
      "dark-blue": "#040D28",
      "dark-gray": "#515358",
      red: "#B55D62"
    }
  },
  plugins: []
};
