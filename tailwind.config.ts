/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        apple: {
          blue: '#0071E3',
          'blue-dark': '#2997FF',
          gray: '#86868B',
          'gray-dark': '#A1A1A6',
          'bg': '#F5F5F7',
          'bg-dark': '#1D1D1F',
          'text': '#1D1D1F',
          'text-dark': '#F5F5F7',
          'card-dark': '#2D2D2D',
        },
      },
    },
  },
  plugins: [],
}
