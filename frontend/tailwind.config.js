/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#0c0b12',
        'surface': '#14131c',
        'surface2': '#1c1b27',
        'border': '#252336',
        'text': '#edeaf8',
        'muted': '#5a5480',
        'primary': '#b49de0',    // purple
        'secondary': '#5fbfaa',  // teal
        'accent': '#e08a5a',     // orange
        'gold': '#c8a96e',
      },
      fontFamily: {
        'display': ['var(--font-bricolage)'],
        'sans': ['var(--font-space-grotesk)'],
      },
      animation: {
        'mesh-float': 'meshFloat 9s ease-in-out infinite alternate',
        'scroll': 'scroll 22s linear infinite',
      },
      keyframes: {
        meshFloat: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.07) translate(-12px, 10px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
