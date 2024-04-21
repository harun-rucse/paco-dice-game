import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-background": "url('/hero-bg.png')",
        "main-background": "url('/main-bg.svg')",
      },
      fontFamily: {
        baloo: ["Baloo"],
      },
    },
    screens: {
      ...defaultTheme.screens,
      tablet: "640px",
      laptop: "1024px",
      desktop: "1600px",
    },
  },
  plugins: [],
};
