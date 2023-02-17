/// <reference types="vitest" />

import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: false,
      skipDiagnostics: true,
      outputDir: path.resolve(__dirname, 'dist', 'types')
    })
  ],
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
      external: ['vue', 'leaflet', '@vueuse/core', '@vueuse/shared'],
      output: {
        globals: {
          vue: 'Vue',
          leaflet: 'L',
          '@vueuse/core': 'VueUse',
          '@vueuse/shared': 'VueUse'
        }
      }
    }
  },
  test: {
    environment: 'jsdom'
  }
});
