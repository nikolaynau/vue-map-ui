# vue-map-ui [![npm version](https://img.shields.io/npm/v/vue-map-ui.svg)](https://npmjs.org/package/vue-map-ui) [![npm downloads](https://img.shields.io/npm/dm/vue-map-ui.svg)](https://npmjs.org/package/vue-map-ui)

> Vue 3 map component library based on leaflet.

[Documentation & Demo](https://vuemap.org)

## Installation

```bash
# NPM
$ npm install vue-map-ui leaflet

# Yarn
$ yarn add vue-map-ui leaflet

# pnpm
$ pnpm install vue-map-ui leaflet
```

## Usage

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
// import styles
import 'leaflet/dist/leaflet.css';
import 'vue-map-ui/dist/normalize.css';
import 'vue-map-ui/dist/style.css';
import 'vue-map-ui/dist/theme-all.css';

createApp(App).mount('#app');
```

```vue
<script setup>
// Map.vue
import { VMap, VMapOsmTileLayer, VMapZoomControl } from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px;">
    <VMapOsmTileLayer />
    <VMapZoomControl />
  </VMap>
</template>
```

## Auto import

```bash
$ npm install -D unplugin-vue-map-ui unplugin-vue-components
```

<details>
<summary>Vite</summary>
<br>

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { VueMapUiResolver, VueMapUiPreset } from 'unplugin-vue-map-ui';

export default defineConfig({
  // ...
  plugins: [
    // ...
    Components({
      resolvers: [VueMapUiResolver()],
      types: [VueMapUiPreset]
    })
  ]
});
```

<br>
</details>

<details>
<summary>Webpack</summary>
<br>

```ts
// webpack.config.js
const Components = require('unplugin-vue-components/webpack');
const { VueMapUiResolver, VueMapUiPreset } = require('unplugin-vue-map-ui');

module.exports = {
  // ...
  plugins: [
    Components({
      resolvers: [VueMapUiResolver()],
      types: [VueMapUiPreset]
    })
  ]
};
```

<br>
</details>

> If you use typescript, make sure you also add `components.d.ts` to your `tsconfig.json` under `include`.

## Volar support

If you use volar, please add the global component type definition to `compilerOptions.types` in `tsconfig.json`.

```js
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["vue-map-ui/global"]
  }
}
```

## Typescript

If you use typescript, please add the type definitions for `leaflet` library.

```bash
$ npm install -D @types/leaflet
```

## Nuxt

For Nuxt users, you only need to install `nuxt-vue-map-ui`.

```bash
$ npm install -D nuxt-vue-map-ui
```

Then add the code below into your config file.

```js
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-vue-map-ui'],
  vueMap: {
    /** Options */
  }
});
```

Refer to the [docs](https://github.com/nikolaynau/nuxt-vue-map-ui#readme) for how to configure it.

## License

Licensed under the [MIT License](./LICENSE).
