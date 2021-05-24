module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        '-10': '-10',
      },
      colors: {
        brand: {
          primary: '#303436',
          secondary: '#2e4561',
          tertiary: '#20242e',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
