/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Default font ab "Inter" hoga
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Ultra Modern Dark Palette
        dark: "#030712",       // Deepest Black (Background)
        darkLight: "#111827",  // Slightly Lighter (Cards/Navbar)
        primary: "#6366f1",    // Electric Indigo (Action Color)
        accent: "#a855f7",     // Purple Accent (Gradients ke liye)
        muted: "#9ca3af",      // Gray text ke liye
      }
    },
  },
  plugins: [],
}