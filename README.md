# vue3-map-ui [![npm version](https://img.shields.io/npm/v/vue3-map-ui.svg)](https://npmjs.org/package/vue3-map-ui) [![npm downloads](https://img.shields.io/npm/dm/vue3-map-ui.svg)](https://npmjs.org/package/vue3-map-ui)

> Vue 3 map component library based on leaflet.

[Live Demo](https://nikolaynau.github.io/vue3-map-ui-docs/)

## Installation

```bash
# NPM
$ npm install vue3-map-ui leaflet

# Yarn
$ yarn add vue3-map-ui leaflet

# pnpm
$ pnpm install vue3-map-ui leaflet
```

## Usage

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
// import styles
import 'leaflet/dist/leaflet.css';
import 'vue3-map-ui/dist/normalize.css';
import 'vue3-map-ui/dist/style.css';

createApp(App).mount('#app');
```

## License

Licensed under the [MIT License](./LICENSE).
