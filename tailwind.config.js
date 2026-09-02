/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Stitch Kinetic Zero Design Tokens
        surface: {
          lowest: '#0c0e12',
          DEFAULT: '#111317',
          low: '#1a1c1f',
          container: '#1e2023',
          high: '#282a2e',
          highest: '#333539',
          bright: '#37393d',
        },
        border: {
          subtle: '#2a2d34',
          DEFAULT: '#333539',
          strong: '#424656',
        },
        primary: {
          DEFAULT: '#0066ff',
          hover: '#0054d6',
          light: '#b3c5ff',
          dim: '#8cb1ff',
          glow: 'rgba(0, 102, 255, 0.25)',
        },
        accent: {
          cyan: '#00f0ff',
          glow: 'rgba(0, 240, 255, 0.2)',
        },
        disruption: {
          DEFAULT: '#ef4444',
          bright: '#ff3b30',
          dark: '#c5020b',
          dim: '#ffb4aa',
          glow: 'rgba(239, 68, 68, 0.25)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fde68a',
          glow: 'rgba(245, 158, 11, 0.25)',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#a7f3d0',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        text: {
          primary: '#f1f3f9',
          secondary: '#c2c6d8',
          muted: '#8c90a1',
          subtle: '#5c6070',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px -3px rgba(0, 102, 255, 0.35)',
        'glow-danger': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'glow-success': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-warning': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
