/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#060a12',
          900: '#0f172a',
          850: '#131d35',
          800: '#1e293b',
          700: '#334155',
        },
        neon: {
          cyan: '#00f0ff',
          green: '#00ff88',
          red: '#ff2a5f',
          yellow: '#ffe600',
          purple: '#b026ff',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.45)',
        'glow-red': '0 0 25px rgba(255, 42, 95, 0.6)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.45)',
      },
      animation: {
        'alarm-pulse': 'alarmPulse 1.2s infinite ease-in-out',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        alarmPulse: {
          '0%, 100%': { backgroundColor: 'rgba(255, 42, 95, 0.15)', borderColor: 'rgba(255, 42, 95, 0.9)' },
          '50%': { backgroundColor: 'rgba(255, 42, 95, 0.45)', borderColor: 'rgba(255, 42, 95, 1)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
};
