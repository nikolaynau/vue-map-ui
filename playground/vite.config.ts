import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue-map-ui': resolve(__dirname, '../src/index.ts')
    },
    dedupe: ['vue']
  }
});
