/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  experimental: {
    optimizeUniversalDefaults: false, // fixes html2pdf oklch issue
  },
  plugins: [],
};
