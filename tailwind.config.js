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
          50: '#fef9e7',
          100: '#fdf0c4',
          200: '#fce38d',
          300: '#fad24f',
          400: '#f6c020',
          500: '#d4a017',
          600: '#b37e0e',
          700: '#8a5c0c',
          800: '#704a10',
          900: '#5f3e13',
        },
        cream: {
          50: '#fefdfb',
          100: '#faf9f6',
          200: '#f3f1ec',
          300: '#e8e4de',
          400: '#d5d0c8',
        },
        charcoal: {
          700: '#3d3832',
          800: '#2d2a26',
          900: '#1a1816',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'card-xl': '0 16px 48px rgba(0,0,0,0.14)',
        'glass': '0 8px 32px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'card': '12px',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease',
      },
    },
  },
  plugins: [],
}
