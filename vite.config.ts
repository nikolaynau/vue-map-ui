import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueMapUI',
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        '@vueuse/core',
        '@vueuse/shared',
        'vue-use-leaflet',
        'leaflet',
        'uuid'
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueUse',
          '@vueuse/shared': 'VueUse',
          'vue-use-leaflet': 'VueUseLeaflet',
          leaflet: 'L',
          uuid: 'uuidv4'
        }
      }
    }
  }
});
