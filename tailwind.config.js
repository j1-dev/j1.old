/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cg: ['Cormorant Garamond', 'serif'],
        mono: ['Xanh Mono', 'mono'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
    screens: {
      sm: '348px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
};
