/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          surface: '#f3f6f9',
          surfaceSoft: '#e4eaf0',
          surfaceNeutral: '#f5f5f5',
          surfaceStrong: '#102640',
          surfaceStrongNeutral: '#262626',
          cartCard: '#536880',
          cartCardInner: '#193556',
          text: '#193556',
          textMuted: '#536880',
          textStrong: '#102640',
          textNeutral: '#000000',
          textNeutralSoft: '#525252',
          textInverted: '#ffffff',
          textInvertedMuted: '#d4d4d4',
          border: '#193556',
          borderSoft: '#c5ccd5',
          danger: '#dc2626',
          dangerSoft: '#fecaca',
          success: '#16a34a',
        },
      },
    },
  },
  plugins: [],
};
