/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Warm Cream & Latte Palette
        surface: {
          lowest: '#f5efe4',
          DEFAULT: '#fbf7f0',
          low: '#fdfbf7',
          container: '#ffffff',
          high: '#f7f2e8',
          highest: '#eee7d8',
          bright: '#ffffff',
        },
        cream: {
          50: '#fdfbf7',
          100: '#fbf7f0',
          200: '#f5efe4',
          300: '#eee7d8',
          400: '#dfd4be',
          500: '#c5b597',
          amber: '#d97706',
          gold: '#b45309',
        },
        border: {
          subtle: 'rgba(120, 90, 50, 0.08)',
          DEFAULT: 'rgba(120, 90, 50, 0.12)',
          strong: 'rgba(120, 90, 50, 0.20)',
          cream: 'rgba(217, 119, 6, 0.25)',
        },
        primary: {
          DEFAULT: '#1d4ed8',
          hover: '#1e40af',
          light: '#2563eb',
          dim: '#3b82f6',
          glow: 'rgba(37, 99, 235, 0.15)',
        },
        accent: {
          cream: '#fbf7f0',
          gold: '#d97706',
          cyan: '#0284c7',
          glow: 'rgba(217, 119, 6, 0.15)',
        },
        disruption: {
          DEFAULT: '#e11d48',
          bright: '#f43f5e',
          dark: '#be123c',
          dim: '#ffe4e6',
          glow: 'rgba(225, 29, 72, 0.15)',
        },
        warning: {
          DEFAULT: '#d97706',
          light: '#fef3c7',
          glow: 'rgba(217, 119, 6, 0.15)',
        },
        success: {
          DEFAULT: '#059669',
          light: '#d1fae5',
          glow: 'rgba(5, 150, 105, 0.15)',
        },
        text: {
          primary: '#1c1917',
          secondary: '#44403c',
          muted: '#78716c',
          subtle: '#a8a29e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 8px 25px -4px rgba(37, 99, 235, 0.2)',
        'glow-cream': '0 8px 25px -4px rgba(217, 119, 6, 0.18)',
        'glow-danger': '0 8px 25px -4px rgba(225, 29, 72, 0.2)',
        'glow-success': '0 8px 25px -4px rgba(5, 150, 105, 0.2)',
        'glass-warm': '0 10px 30px -5px rgba(120, 80, 40, 0.08), 0 2px 6px -1px rgba(120, 80, 40, 0.04)',
        'card-cream': '0 6px 20px -3px rgba(120, 80, 40, 0.06), 0 2px 4px -1px rgba(120, 80, 40, 0.03)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
