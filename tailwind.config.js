/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#0f172a',    // 짙은 남색 배경
        'snake-bass': '#3b82f6', // 파란색 (Bass)
        'snake-pad': '#8b5cf6',  // 보라색 (Pad)
        'snake-lead': '#ef4444', // 빨간색 (Lead)
        'snake-perc': '#10b981', // 초록색 (Percussion)
      },
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}