/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(124, 58, 237, 0.25), 0 12px 40px rgba(124, 58, 237, 0.12)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace']
      }
    }
  },
  plugins: []
};
