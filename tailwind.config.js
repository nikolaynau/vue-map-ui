/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.vue', './playground/**/*.vue'],
  theme: {
    extend: {
      colors: {
        'map-foreground': 'var(--v-map-foreground)',
        'map-background': 'var(--v-map-background)'
      },
      fontSize: {
        'map-base': ['var(--v-map-font-size)', 'var(--v-map-line-height)']
      }
    }
  },
  plugins: []
};
