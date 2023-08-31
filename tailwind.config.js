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
        'scale-foreground': 'var(--v-map-scale-foreground)',
        'scale-background': 'var(--v-map-scale-background)',
        'scale-border': 'var(--v-map-scale-border)',
        'scale-border-highlight': 'var(--v-map-scale-border-highlight)',
        'control-foreground': 'var(--v-map-control-foreground)',
        'control-hover-foreground': 'var(--v-map-control-hover-foreground)',
        'control-background': 'var(--v-map-control-background)',
        'control-hover-background': 'var(--v-map-control-hover-background)',
        'control-disabled-foreground':
          'var(--v-map-control-disabled-foreground)',
        'control-disabled-background':
          'var(--v-map-control-disabled-background)',
        'pin-icon-background': 'var(--v-map-pin-icon-background)',
        'pin-icon-foreground': 'var(--v-map-pin-icon-foreground)',
        'pin-icon-placeholder': 'var(--v-map-pin-icon-placeholder)'
      },
      fontSize: {
        0: '0',
        map: ['var(--v-map-font-size)', 'var(--v-map-line-height)'],
        attribution: 'var(--v-map-attribution-font-size)',
        scale: 'var(--v-map-scale-font-size)',
        control: 'var(--v-map-control-font-size)',
        'pin-icon': 'var(--v-map-pin-icon-font-size)',
        'pin-icon-svg': 'var(--v-map-pin-icon-svg-font-size)'
      },
      spacing: {
        'control-position-horizontal-left':
          'var(--v-map-control-position-horizontal-left)',
        'control-position-horizontal-right':
          'var(--v-map-control-position-horizontal-right)'
      },
      width: {
        '1em': '1em',
        control: 'var(--v-map-control-width)',
        'pin-icon-svg': 'var(--v-map-pin-icon-svg-width)'
      },
      height: {
        '1em': '1em',
        control: 'var(--v-map-control-height)',
        'pin-icon-svg': 'var(--v-map-pin-icon-svg-height)'
      },
      lineHeight: {
        control: 'var(--v-map-control-line-height)'
      },
      borderRadius: {
        control: 'var(--v-map-control-round)',
        'control-one-child': 'var(--v-map-control-one-child-round)',
        attribution: 'var(--v-map-attribution-border-radius)'
      },
      boxShadow: {
        control: '0 2px 6px var(--v-map-control-shadow)'
      },
      margin: {
        'control-corner': 'var(--v-map-control-corner-margin)'
      },
      zIndex: {
        1000: '1000'
      }
    }
  },
  plugins: []
};
