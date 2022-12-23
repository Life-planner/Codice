/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    theme: "custom",
    themes: [
      {
        custom: {
          primary: "#00AEAC",
          secondary: "#29C897",
          accent: "#29C897",
          neutral: "#171619",
          "base-100": "#FFE7D5",
          info: "#91D2FF",
          success: "#A9FFCB",
          warning: "#FFC16C",
          error: "#FFA48E",
          "primary-content": "#FFF8F1",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
