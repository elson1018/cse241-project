/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm editorial palette
        primary: '#D68C8C', // Dusty rose / terracotta
        secondary: '#E9AFAF', // Softer rose for gradients
        accent: '#E9C46A', // Muted gold
        cream: '#FFF5E6', // Warm cream background
        peach: '#FFE3D4', // Soft peach
        burgundy: '#4A2C2A', // Deep burgundy for headings/text
        background: '#FFF5E6', // Alias for main background
        'text-main': '#4A2C2A', // Primary text color
      },
      boxShadow: {
        'card-soft': '0 10px 30px -10px rgba(74, 44, 42, 0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

