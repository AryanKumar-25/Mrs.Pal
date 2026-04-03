/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#c14e30', // Deep terracotta/orange
          accent: '#e26b4d',
          background: '#fdfbf7', // Creamy off-white
          text: '#222222', // Dark charcoal
          light: '#f4ede4',
          green: '#22c55e', // Success/Positive
          red: '#ef4444', // Alert/Pending
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cursive: ['"Dancing Script"', 'cursive'],
      }
    },
  },
  plugins: [],
}
