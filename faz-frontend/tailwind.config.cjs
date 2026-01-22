/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defining these is mandatory for the classes to work
        'faz-green': '#006837', 
        'faz-dark': '#062916',
        'faz-orange': '#F7941D',
      },
    },
  },
  plugins: [],
}