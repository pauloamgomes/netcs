import type { Config } from "tailwindcss";

const themes = require("daisyui/src/theming/themes");

themes.light;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/templates/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "576px",
      md: "960px",
      lg: "1180px",
    },
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...themes.light,
          ".hero-content": {
            "@apply text-neutral": "",
          },
          ".hero-content .hero-bg-btn-cta": {
            "@apply border-neutral text-neutral hover:bg-neutral/20": "",
          },
          ".nav-header": {
            "@apply text-neutral": "",
          },
        },
        dark: {
          ...themes.dark,
          ".hero-content": {
            "@apply text-white": "",
          },
          ".hero-content .hero-bg-btn-cta": {
            "@apply border-white text-white hover:bg-white/20": "",
          },
          ".nav-header": {
            "@apply text-white": "",
          },
        },
      },
    ],
  },
};

export default config;
