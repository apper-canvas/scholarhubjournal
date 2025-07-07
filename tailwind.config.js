/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ebf4ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#2C5282',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#38B2AC',
          900: '#134e4a',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#ED8936',
          900: '#7c2d12',
        },
        surface: '#F7FAFC',
        background: '#EDF2F7',
        success: '#48BB78',
        warning: '#F6AD55',
        error: '#F56565',
        info: '#4299E1',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '240': '60rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.12)',
        'form': '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
    },
  },
  plugins: [],
}