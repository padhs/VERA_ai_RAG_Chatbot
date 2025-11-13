/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f8f3',
          100: '#eef0e6',
          200: '#dde2cd',
          300: '#c6d0a8',
          400: '#a8b87c',
          500: '#6B8E23', // Main olive green
          600: '#5a7a1e',
          700: '#4a6219',
          800: '#3d4f15',
          900: '#334112',
        },
        accent: {
          50: '#f8f7f4',
          100: '#f0ede6',
          200: '#e0d9cc',
          300: '#cbc0a8',
          400: '#b3a37f',
          500: '#9c8a5f', // Soft beige
          600: '#8a7a52',
          700: '#736545',
          800: '#5f5339',
          900: '#4f4530',
        },
        sage: {
          50: '#f6f7f4',
          100: '#e9ede6',
          200: '#d4dccd',
          300: '#b8c5a8',
          400: '#9aa87f',
          500: '#7d8a5f', // Sage green
          600: '#6a744f',
          700: '#575e42',
          800: '#484d37',
          900: '#3d412f',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Arimo', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
