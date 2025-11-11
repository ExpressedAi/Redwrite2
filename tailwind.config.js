/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        // Primitives Brand Colors - Nearly-Whites & Graphites
        'snow': '#FCFCFD',
        'cloud': '#F4F6F8',
        'mist': '#ECEFF3',
        'graphite': {
          900: '#0B0D10',
          700: '#151A20',
        },
        'silver': {
          500: '#9AA3AF',
        },
        // Primitives Accent Colors (use sparingly)
        'delta-blue': '#3A8FFF',
        'orchid': '#A28BFF',
        'mint': '#8BF2E6',
        'amber': '#FFC66D',
      },
      borderRadius: {
        'xs': '6px',
        'md': '10px',
        'xl': '16px',
        '2xl': '20px',
      },
      backdropBlur: {
        'glass': '12px',
      },
      spacing: {
        'unit': '8px',
      },
      transitionTimingFunction: {
        'snap': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        'hold': 'cubic-bezier(0.33, 0.0, 0.67, 1)',
        'release': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'micro': '140ms',
        'ui': '240ms',
        'page': '420ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
