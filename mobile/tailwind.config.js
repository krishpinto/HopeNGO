/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#faf9f6',     // Archival surface
        surface: '#ffffff',
        primary: {
          DEFAULT: '#047857',      // Emerald
          foreground: '#ffffff',
          light: '#059669',
        },
        muted: '#f2f0ea',
        'muted-foreground': '#78716c',
        border: '#e7e5e4',
      },
      fontFamily: {
        heading: ['Times New Roman', 'serif'], // Fallback mapping for Newsreader
        sans: ['System', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
