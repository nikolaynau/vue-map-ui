<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { LeafletEventHandlerFn, TileLayerOptions } from 'leaflet';
import { useLeafletTileLayer, useLeafletToggleLayer } from 'vue-use-leaflet';
import { useMap, useEvents, useAttrs } from '@/composables';

export interface Props extends TileLayerOptions {
  url?: string;
}

const props = defineProps<Props>();

const { url } = toRefs(props);
const map = useMap();
const { events, attrs } = useAttrs<LeafletEventHandlerFn>();
const tileLayer = useLeafletTileLayer(url, attrs);
useLeafletToggleLayer(map, tileLayer);
useEvents(tileLayer, events);

defineExpose({
  tileLayer
});
</script>

<template>
  <slot></slot>
</template>
