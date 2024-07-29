/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      padding: {'scrollbar-padding': 'calc(100vw - 100%)'}
    },
  },
  plugins: [],
}

