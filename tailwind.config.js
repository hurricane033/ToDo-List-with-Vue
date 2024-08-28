const { setTransitionHooks } = require('vue');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Dosis'],
        cursive: ['Playwrite DK Loopet'],
        monospace:['Roboto Mono']
      },
    },
  },
  plugins: [],
}

