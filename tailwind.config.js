/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nunito', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'pastel': {
          'purple': '#E8E2FF',
          'yellow': '#FFF9E8',
          'green': '#E8F5E8',
          'blue': '#E8F4FF',
          'pink': '#FFE8F1',
          'orange': '#FFE8D6',
          'cyan': '#E8FFFF',
          'lavender': '#F0E8FF',
        },
        'soft': {
          'purple': '#D1C4E9',
          'yellow': '#FFF176',
          'green': '#C8E6C9',
          'blue': '#BBDEFB',
          'pink': '#F8BBD9',
          'orange': '#FFCC80',
          'cyan': '#B2EBF2',
          'lavender': '#E1BEE7',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
