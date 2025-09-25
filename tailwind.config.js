/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // Or if you have a `src` directory
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: {
    "@tailwindcss/postcss": {},
  }
};

export default config;
