<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { onUnmounted, toRefs } from 'vue';
import type { LeafletEventHandlerFn, TileLayerOptions } from 'leaflet';
import { useLeafletTileLayer, useLeafletToggleLayer } from 'vue-use-leaflet';
import { useMap, useEvents, useAttrs } from '@/composables';
import { provideLayer } from '@/composables/useLayer';
import { isReady } from '@/utils/isReady';

export interface Props extends TileLayerOptions {
  url?: string;
}

const props = defineProps<Props>();

const { url } = toRefs(props);
const map = useMap();
const { events, attrs } = useAttrs<LeafletEventHandlerFn>();
const tileLayer = useLeafletTileLayer(url, attrs);
const ready = isReady(tileLayer);

useLeafletToggleLayer(map, tileLayer);
useEvents(tileLayer, events);
provideLayer(tileLayer);

defineExpose({
  tileLayer
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
