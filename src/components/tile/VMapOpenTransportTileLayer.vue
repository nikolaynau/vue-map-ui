<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import type { TileLayer, TileLayerOptions } from 'leaflet';
import { useTemplateRef } from '../../composables/internal/useTemplateRef';
import { pickProps } from '../../utils/props';
import VMapTileLayer from '../layer/VMapTileLayer.vue';

export interface Props extends TileLayerOptions {
  apiKey: string;
  title?: string;
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Open Transport'
});

const instance = getCurrentInstance()!;
const { rest } = pickProps(
  instance,
  props,
  ['apiKey', 'title', 'overlay'],
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
    url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apiKey}"
    :api-key="apiKey"
    :title="title"
    :overlay="overlay"
    v-bind="rest"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
