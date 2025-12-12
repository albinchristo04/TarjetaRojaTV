/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        card: "#161616",
        primary: "#39FF14", // Neon Green
        secondary: "#007BFF", // Electric Blue
        live: "#FF2D2D",
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
