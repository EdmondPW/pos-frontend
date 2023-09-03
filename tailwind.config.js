/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        saxmono: ["saxmono", "sans-serif"],
      },
      fontFamily: {
        times: ["times", "sans-serif"],
      },
    },
  },
  plugins: [],
};
