const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    'src/**/*.html',
    'src/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          100: '#f1a9ab',
          200: '#ea7e81',
          300: '#e35256',
          400: '#df3d42',
          500: '#dc282d',
          600: '#c62428',
          700: '#b02024',
          800: '#9a1c1f',
          900: '#84181b',
        },
        lightwhite: '#F7F7FA',
        lightpurple: {
          100: '#3e3e3e',
          200: '#373737',
          300: '#313131',
          400: '#2b2b2b',
          500: '#191919',
          600: '#1f1f1f',
          700: '#181818',
          800: '#121212',
          900: '#0c0c0c',
        },
        dimgray: {
          100: '#6F6F6F',
          200: '#666666',
          300: '#5C5C5C',
          400: '#525252',
          500: '#474747',
          600: '#3D3D3D',
          700: '#333333',
          800: '#292929',
          900: '#1F1F1F',
        },
      },
      boxShadow: {
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
        xxl: '10px 20px 40px 10px rgba(41, 41, 41, 0.15)',
        hb: '0px 25px 30px 10px rgba(0,0,0,0.06)',
      },
      outline: {
        blue: '2px solid rgba(0, 112, 244, 0.5)',
      },
      fontFamily: {
        inter: ['Raleway', 'sans-serif'],
        arial: ['Arial', 'Helvetica, sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5715' }],
        base: ['1rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.33', letterSpacing: '-0.01em' }],
        '3xl': ['1.88rem', { lineHeight: '1.33', letterSpacing: '-0.01em' }],
        '4xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      screens: {
        xs: '480px',
      },
      borderWidth: {
        3: '3px',
      },
      minWidth: {
        36: '9rem',
        44: '11rem',
        56: '14rem',
        60: '15rem',
        72: '18rem',
        80: '20rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        60: '60',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('tailwind-scrollbar'),
    // eslint-disable-next-line global-require
    require('@tailwindcss/forms'),
    // add custom variant for expanding sidebar
    plugin(({ addVariant, e }) => {
      addVariant('sidebar-expanded', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => `.sidebar-expanded .${e(`sidebar-expanded${separator}${className}`)}`);
      });
    }),
  ],
  variants: {
    scrollbar: ['rounded'],
  },
};
