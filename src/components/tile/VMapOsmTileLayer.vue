<script setup lang="ts">
import type { TileLayer } from 'leaflet';
import { useRef } from '../../composables';
import {
  default as VMapTileLayer,
  type Attrs as _Attrs
} from '../layer/VMapTileLayer.vue';

export interface Props {
  title?: string;
  overlay?: boolean;
}

export type Attrs = _Attrs;

withDefaults(defineProps<Props>(), {
  title: 'Open Street Map'
});

const { templateRef, value: tileLayer } = useRef<
  InstanceType<typeof VMapTileLayer>,
  TileLayer | null
>(obj => obj.tileLayer);

defineExpose({
  tileLayer
});
</script>

<template>
  <VMapTileLayer
    ref="templateRef"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    :title="title"
    :overlay="overlay"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
