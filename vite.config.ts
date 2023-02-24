import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Vue3MapUI',
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue-demi',
        'leaflet',
        '@vueuse/core',
        '@vueuse/shared',
        'vue-use-leaflet'
      ],
      output: {
        globals: {
          'vue-demi': 'VueDemi',
          leaflet: 'L',
          '@vueuse/core': 'VueUse',
          '@vueuse/shared': 'VueUse',
          'vue-use-leaflet': 'VueUseLeaflet'
        }
      }
    }
  }
});
