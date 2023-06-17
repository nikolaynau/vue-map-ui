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
        'attribution-background': 'var(--v-map-attribution-background)',
        'control-foreground': 'var(--v-map-control-foreground)',
        'control-hover-foreground': 'var(--v-map-control-hover-foreground)',
        'control-background': 'var(--v-map-control-background)',
        'control-hover-background': 'var(--v-map-control-hover-background)',
        'control-disabled-foreground':
          'var(--v-map-control-disabled-foreground)',
        'control-disabled-background':
          'var(--v-map-control-disabled-background)'
      },
      fontSize: {
        map: ['var(--v-map-font-size)', 'var(--v-map-line-height)'],
        attribution: 'var(--v-map-attribution-font-size)',
        control: 'var(--v-map-control-font-size)'
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
        control: 'var(--v-map-control-round)',
        'control-one-child': 'var(--v-map-control-one-child-round)'
      },
      boxShadow: {
        control: '0 2px 6px var(--v-map-control-shadow)'
      },
      margin: {
        'control-corner': 'var(--v-map-control-corner-margin)'
      }
    }
  },
  plugins: []
};
