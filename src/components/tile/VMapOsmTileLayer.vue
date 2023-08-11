<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import type { TileLayer, TileLayerOptions } from 'leaflet';
import { useTemplateRef } from '../../composables/internal';
import { pickProps } from '../../utils/props';
import VMapTileLayer from '../layer/VMapTileLayer.vue';

export interface Props extends TileLayerOptions {
  title?: string;
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Open Street Map'
});

const instance = getCurrentInstance()!;
const { other } = pickProps(
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
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    :title="title"
    :overlay="overlay"
    v-bind="other"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
