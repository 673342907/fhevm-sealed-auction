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
        // Zama brand colors: Yellow + Black + White
        zama: {
          50: '#fffbeb',   // Lightest yellow
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',  // Bright yellow
          500: '#f59e0b',  // Primary yellow #f59e0b
          600: '#d97706',  // Deep yellow
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',  // Darkest
          black: '#000000', // Pure black
          white: '#ffffff', // Pure white
          dark: '#0a0a0a',  // Dark background
          gold: '#fbbf24',  // Gold accent
          amber: '#f59e0b', // Amber primary
        },
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'zama': '0 4px 14px 0 rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.1)',
        'zama-lg': '0 10px 25px -5px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(245, 158, 11, 0.2)',
        'zama-xl': '0 20px 40px -10px rgba(245, 158, 11, 0.5), 0 0 0 1px rgba(245, 158, 11, 0.3)',
        'glow': '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

