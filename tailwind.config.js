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
        // Luxury Warm Cream & Velvet Obsidian Palette
        surface: {
          lowest: '#0b0a09',
          DEFAULT: '#12100e',
          low: '#171513',
          container: '#1e1b18',
          high: '#27231f',
          highest: '#332e29',
          bright: '#423c35',
        },
        cream: {
          light: '#fdfbf7',
          DEFAULT: '#f5eedc',
          muted: '#ded4c0',
          dark: '#b8ab94',
          gold: '#e2be72',
          amber: '#d99b38',
        },
        border: {
          subtle: 'rgba(245, 238, 220, 0.07)',
          DEFAULT: 'rgba(245, 238, 220, 0.12)',
          strong: 'rgba(245, 238, 220, 0.20)',
          cream: 'rgba(226, 190, 114, 0.35)',
        },
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#bfdbfe',
          dim: '#93c5fd',
          glow: 'rgba(59, 130, 246, 0.25)',
        },
        accent: {
          cream: '#f5eedc',
          gold: '#e2be72',
          cyan: '#38bdf8',
          glow: 'rgba(226, 190, 114, 0.2)',
        },
        disruption: {
          DEFAULT: '#f43f5e',
          bright: '#fb7185',
          dark: '#be123c',
          dim: '#fecdd3',
          glow: 'rgba(244, 63, 94, 0.25)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          glow: 'rgba(245, 158, 11, 0.25)',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        text: {
          primary: '#fbf8f2',
          secondary: '#ded6c5',
          muted: '#9c9281',
          subtle: '#665e52',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -4px rgba(59, 130, 246, 0.35)',
        'glow-cream': '0 0 25px -4px rgba(226, 190, 114, 0.3)',
        'glow-danger': '0 0 25px -4px rgba(244, 63, 94, 0.35)',
        'glow-success': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'glass-warm': '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
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
