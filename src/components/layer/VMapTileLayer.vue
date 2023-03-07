<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { LeafletEventHandlerFn, TileLayerOptions } from 'leaflet';
import {
  useLeafletTileLayer,
  useLeafletToggleLayer,
  useLeafletReady
} from 'vue-use-leaflet';
import { useMap, useEvents, useAttrs, provideLayer } from '../../composables';

export interface Props {
  url?: string;
}

export type Attrs = TileLayerOptions;

const props = defineProps<Props>();

const { url } = toRefs(props);
const map = useMap();
const { events, attrs } = useAttrs<LeafletEventHandlerFn>();
const tileLayer = useLeafletTileLayer(url, attrs);
const ready = useLeafletReady(tileLayer);

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
