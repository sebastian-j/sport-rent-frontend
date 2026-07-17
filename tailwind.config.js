/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          surface: 'rgb(var(--app-surface) / <alpha-value>)',
          surfaceElevated: 'rgb(var(--app-surface-elevated) / <alpha-value>)',
          surfaceSoft: 'rgb(var(--app-surface-soft) / <alpha-value>)',
          surfaceNeutral: 'rgb(var(--app-surface-neutral) / <alpha-value>)',
          surfaceStrong: 'rgb(var(--app-surface-strong) / <alpha-value>)',
          surfaceStrongNeutral: 'rgb(var(--app-surface-strong-neutral) / <alpha-value>)',
          cartCard: 'rgb(var(--app-cart-card) / <alpha-value>)',
          cartCardInner: 'rgb(var(--app-cart-card-inner) / <alpha-value>)',
          text: 'rgb(var(--app-text) / <alpha-value>)',
          textMuted: 'rgb(var(--app-text-muted) / <alpha-value>)',
          textStrong: 'rgb(var(--app-text-strong) / <alpha-value>)',
          textNeutral: 'rgb(var(--app-text-neutral) / <alpha-value>)',
          textNeutralSoft: 'rgb(var(--app-text-neutral-soft) / <alpha-value>)',
          textInverted: 'rgb(var(--app-text-inverted) / <alpha-value>)',
          textInvertedMuted: 'rgb(var(--app-text-inverted-muted) / <alpha-value>)',
          border: 'rgb(var(--app-border) / <alpha-value>)',
          borderSoft: 'rgb(var(--app-border-soft) / <alpha-value>)',
          danger: 'rgb(var(--app-danger) / <alpha-value>)',
          dangerSoft: 'rgb(var(--app-danger-soft) / <alpha-value>)',
          success: 'rgb(var(--app-success) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
