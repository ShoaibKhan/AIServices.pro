/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    options: {
      safelist: [
        "bg-gray-700", // Add other classes you want to safelist
      ],
    },
  },
  content: ["./templates/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#444654",
      },
    },
  },
  plugins: [],
};
