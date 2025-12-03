/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4E56C0',
        secondary: '#9B5DE0',
        accent: '#D78FEE',
        background: '#FDCFFA',
        'text-main': '#1f2937',
      },
    },
  },
  plugins: [],
}

