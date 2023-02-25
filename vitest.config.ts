import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false'
  },
  test: {
    environment: 'jsdom',
    reporters: 'dot',
    setupFiles: [path.resolve(__dirname, '.test/setup.ts')]
  }
});
