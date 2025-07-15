/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      }
    }
  },
  plugins: [
    lineClamp,
  ],
  darkMode: 'class',
}