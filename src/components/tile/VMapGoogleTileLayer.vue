<script setup lang="ts">
import { isDefined } from '@vueuse/shared';
import type { TileLayer } from 'leaflet';
import { computed, toRefs, unref } from 'vue';
import { useTemplateRef } from '../../composables';
import {
  default as VMapTileLayer,
  type Attrs as _Attrs
} from '../layer/VMapTileLayer.vue';

export interface Props {
  type?: 'hybrid' | 'satellite' | 'streets' | 'terrain';
  layers?: string;
  subdomains?: string[];
  title?: string;
  overlay?: boolean;
}

export type Attrs = _Attrs;

const props = withDefaults(defineProps<Props>(), {
  title: 'Google',
  type: 'streets',
  layers: undefined,
  subdomains: () => ['mt0', 'mt1', 'mt2', 'mt3']
});

const { type, layers: _layers } = toRefs(props);

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
  isDefined(_layers) ? unref(_layers) : types[unref(type)] ?? null
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
  >
    <slot></slot>
  </VMapTileLayer>
</template>
