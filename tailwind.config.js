/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.vue', './playground/**/*.vue'],
  theme: {
    extend: {
      colors: {
        'map-foreground': 'var(--v-map-foreground)',
        'map-background': 'var(--v-map-background)',
        'link-foreground': 'var(--v-map-link-foreground)',
        'link-highlight': 'var(--v-map-link-highlight)',
        'attribution-foreground': 'var(--v-map-attribution-foreground)',
        'attribution-background': 'var(--v-map-attribution-background)'
      },
      fontSize: {
        map: ['var(--v-map-font-size)', 'var(--v-map-line-height)'],
        attribution: 'var(--v-map-attribution-font-size)'
      },
      width: {
        control: 'var(--v-map-control-width)'
      },
      height: {
        control: 'var(--v-map-control-height)'
      },
      lineHeight: {
        control: 'var(--v-map-control-line-height)'
      },
      borderRadius: {
        'bar-top': 'var(--v-map-bar-border-top-radius)',
        'bar-bottom': 'var(--v-map-bar-border-bottom-radius)'
      }
    }
  },
  plugins: []
};
