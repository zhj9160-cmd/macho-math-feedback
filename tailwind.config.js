/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1B365D',
        lightblue: '#A8C5E2',
        ivory: '#FAF7F0',
        gold: '#C9A961',
        charcoal: '#2C2C2C',
      },
    },
  },
  plugins: [],
}
