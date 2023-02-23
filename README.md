# vue-map-ui [![npm version](https://img.shields.io/npm/v/vue-map-ui.svg)](https://npmjs.org/package/vue-map-ui) [![npm downloads](https://img.shields.io/npm/dm/vue-map-ui.svg)](https://npmjs.org/package/vue-map-ui)

> Vue 3 map component library based on leaflet.

[Live Demo](https://nikolaynau.github.io/vue-map-ui-docs/)

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

createApp(App).mount('#app');
```

## License

Licensed under the [MIT License](./LICENSE).
