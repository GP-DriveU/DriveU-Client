/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#223A58",
        secondary: "#7ABAF2",
        background: "#FFFFFF",
        primary_light: "#E5ECF9",
        primary_medium: "#61758F",
        danger: "#DD3412",
        success: "#228738",
        white: "#FAFAFA",
        font: "#4D4D4D",
        gray_1: "#EDEDED",
        gray_2: "#F6F6F6",
        black: "#000000",
        category: {
          pencil: "#E5A000",
        },
        tag: {
          yellow: "#FFC95C",
          green: "#7EC88E",
          orange: "#F48771",
          red: "#E0858C",
          gray: "#B1B8BE",
          lightblue: "#9ED2FA",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      fontSize: {
        "logo-extra-bold": ["48px", "auto"],
        "big-extra-bold": ["30px", "auto"],
        "big-bold": ["30px", "auto"],
        "big-regular": ["30px", "auto"],
        "extramedium-semibold": ["24px", "auto"],
        "medium-semibold": ["20px", "auto"],
        "medium-regular": ["20px", "auto"],
        tag: ["15px", "auto"],
        "small-bold": ["12px", "auto"],
        "small-regular": ["12px", "auto"],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        "extra-bold": "800",
      },
    },
  },
  plugins: [],
};
