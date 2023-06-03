<script setup lang="ts">
import type { TileLayer } from 'leaflet';
import { useRef } from '../../composables';
import {
  default as VMapTileLayer,
  type Attrs as _Attrs
} from '../layer/VMapTileLayer.vue';

export interface Props {
  apiKey: string;
  title?: string;
  overlay?: boolean;
}

export type Attrs = _Attrs;

withDefaults(defineProps<Props>(), {
  title: 'Open Transport'
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
    url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apiKey}"
    :api-key="apiKey"
    :title="title"
    :overlay="overlay"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
