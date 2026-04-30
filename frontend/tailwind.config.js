export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        slate: {
          950: '#020617',
        },
        success: '#10b981',
        danger: '#f43f5e',
        warning: '#f59e0b',
        accent: '#22d3ee',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,.08), 0 20px 60px rgba(15,23,42,.45)',
      },
    },
  },
  plugins: [],
}
