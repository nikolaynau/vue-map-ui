<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import type { TileLayer, TileLayerOptions } from 'leaflet';
import { useTemplateRef } from '../../composables/internal/useTemplateRef';
import { pickProps } from '../../utils/props';
import VMapTileLayer from '../layer/VMapTileLayer.vue';

export interface Props extends TileLayerOptions {
  title?: string;
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Arc Gis Aero'
});

const instance = getCurrentInstance()!;
const { rest } = pickProps(
  instance,
  props,
  ['title', 'overlay'],
  [],
  true,
  true
);

const { templateRef, value: tileLayer } = useTemplateRef<
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
    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    :title="title"
    :overlay="overlay"
    v-bind="rest"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
