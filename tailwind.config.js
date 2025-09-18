import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.red[600],
    "primary-hover": colors.red[700],
        accent: colors.teal[500],
        "accent-hover": colors.teal[600],
        neutral: colors.slate,
        background: colors.slate[50],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};