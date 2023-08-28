<script setup lang="ts">
import { computed, unref, getCurrentInstance } from 'vue';
import { isDefined } from '@vueuse/shared';
import type { TileLayer, TileLayerOptions } from 'leaflet';
import { useTemplateRef } from '../../composables/internal/useTemplateRef';
import { pickProps } from '../../utils/props';
import VMapTileLayer from '../layer/VMapTileLayer.vue';

export interface Props extends TileLayerOptions {
  type?: 'hybrid' | 'satellite' | 'streets' | 'terrain';
  layers?: string;
  subdomains?: string[];
  title?: string;
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Google',
  type: 'streets',
  layers: undefined,
  subdomains: () => ['mt0', 'mt1', 'mt2', 'mt3']
});

const instance = getCurrentInstance()!;
const {
  refs: { layers, type },
  rest
} = pickProps(
  instance,
  props,
  ['type', 'layers', 'subdomains', 'title', 'overlay'],
  [],
  true
);

const { templateRef, value: tileLayer } = useTemplateRef<
  InstanceType<typeof VMapTileLayer>,
  TileLayer | null
>(obj => obj.tileLayer);

const types = Object.freeze({
  hybrid: 's,h',
  satellite: 's',
  streets: 'm',
  terrain: 'p'
});

const lyrs = computed<string | null>(() =>
  isDefined(layers) ? unref(layers) : types[unref(type)] ?? null
);

defineExpose({
  tileLayer
});
</script>

<template>
  <VMapTileLayer
    ref="templateRef"
    url="https://{s}.google.com/vt/lyrs={lyrs}&x={x}&y={y}&z={z}"
    :lyrs="lyrs"
    :subdomains="subdomains"
    :title="title"
    :overlay="overlay"
    v-bind="rest"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
