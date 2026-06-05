/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0b2447',
          dark: '#000f27',
          light: '#1f3e6d',
          container: '#d6e3ff',
          on: '#ffffff',
        },
        secondary: {
          DEFAULT: '#ff9933', // Saffron Orange
          dark: '#8f4e00',
          container: '#ffdcc2',
          on: '#ffffff',
        },
        success: {
          DEFAULT: '#138808', // Green
          dark: '#012c00',
          container: '#e6f4ea',
          on: '#ffffff',
        },
        background: '#f7f9fb',
        surface: {
          DEFAULT: '#ffffff',
          dim: '#d8dadc',
          container: '#eceef0',
          low: '#f2f4f6',
          lowest: '#ffffff',
          high: '#e6e8ea',
          highest: '#e0e3e5',
        },
        onBackground: '#191c1e',
        onSurface: '#191c1e',
        onSurfaceVariant: '#44474e',
        outline: '#74777f',
        outlineVariant: '#c4c6cf',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'ambient': '0px 4px 20px rgba(11, 36, 71, 0.08)',
        'premium': '0 10px 30px -10px rgba(11, 36, 71, 0.15)',
      }
    },
  },
  plugins: [],
}
