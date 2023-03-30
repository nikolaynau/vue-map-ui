<script setup lang="ts">
import type { TileLayer } from 'leaflet';
import { useRef } from '../../composables';
import {
  default as VMapTileLayer,
  type Attrs as _Attrs
} from '../layer/VMapTileLayer.vue';

export interface Props {
  id: string;
  accessToken: string;
  title?: string;
  overlay?: boolean;
}

export type Attrs = _Attrs;

withDefaults(defineProps<Props>(), {
  title: 'Mapbox'
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
    url="https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
    :id="id"
    :access-token="accessToken"
    :title="title"
    :overlay="overlay"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
