<script setup lang="ts">
import {
  default as VMapTileLayer,
  type Attrs as _Attrs
} from '../layer/VMapTileLayer.vue';

export type Attrs = _Attrs;
</script>

<template>
  <VMapTileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    title="Open Street Map"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
