import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#800020',
          50: '#fef2f4',
          100: '#fde6e9',
          200: '#fad1d8',
          300: '#f7aab8',
          400: '#f17a93',
          500: '#e74d70',
          600: '#d12b52',
          700: '#b01e41',
          800: '#941c3c',
          900: '#800020',
          950: '#470010',
        },
      },
    },
  },
  plugins: [],
};
export default config;
