const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#000000',
      primary: colors.teal,
      neutral: {
        100: '#F7FAFC',
        200: '#EDF2F7',
        300: '#E2E8F0',
        400: '#CBD5E0',
        500: '#A0AEC0',
        600: '#718096',
        700: '#4A5568',
        800: '#2D3748',
        900: '#1A202C',
      },
      success: {
        'dark': '#276749',
        'base': '#48BB78',
        'light': '#9AE6B4',
      },
      warning: {
        'dark': '#975A16',
        'base': '#ECC94B',
        'light': '#F6E05E',
      },
      error: {
        'dark': '#9B2C2C',
        'base': '#F56565',
        'light': '#FEB2B2',
      },
      info: {
        'dark': '#2C5282',
        'base': '#4299E1',
        'light': '#BEE3F8',
      },
    },
    fontFamily: {
      'display': ['Comfortaa', 'sans-serif'],
      'body': ['Open Sans', 'sans-serif']
    },
    screens: {
      'xl': {'max': '1279px'},
      'lg': {'max': '1023px'},
      'md': {'max': '767px'},
      'sm': {'max': '639px'},
      'xs': {'max': '425px'},
    },
    extend: {
      width: { 96: '24rem' },
      zIndex: { 
        '1': '1',
        '2': '2',
        '100': '100'
      },
      margin: { 160: '40rem' }
    }
  },
  variants: {
    borderWidth: ['responsive', 'hover', 'focus']
  },
  plugins: []
}