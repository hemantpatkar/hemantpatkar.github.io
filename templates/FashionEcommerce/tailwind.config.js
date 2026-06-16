/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan every page and the shared JS (header + product cards are built there)
  // so dynamically-generated class names are not purged from the build.
  content: ["./*.html", "./templates/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
