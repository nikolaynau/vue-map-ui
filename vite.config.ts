import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Vue3MapUI',
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        'leaflet',
        '@vueuse/core',
        '@vueuse/shared',
        'vue-use-leaflet'
      ],
      output: {
        globals: {
          vue: 'Vue',
          leaflet: 'L',
          '@vueuse/core': 'VueUse',
          '@vueuse/shared': 'VueUse',
          'vue-use-leaflet': 'VueUseLeaflet'
        }
      }
    }
  }
});
