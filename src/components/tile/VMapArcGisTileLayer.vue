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
  title: 'Arc Gis'
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
    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
    :title="title"
    :overlay="overlay"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
