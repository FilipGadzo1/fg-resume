/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: {
          base: '#0c0c0c',
          surface: '#111111',
          card: '#181818',
          hover: '#1e1e1e',
        },
        brand: {
          DEFAULT: '#f97316',
          light: '#fb923c',
          dim: 'rgba(249,115,22,0.1)',
          border: 'rgba(249,115,22,0.25)',
        },
      },
      animation: {
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
      },
      keyframes: {
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(6px)', opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}
