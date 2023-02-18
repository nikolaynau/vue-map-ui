<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { LeafletEventHandlerFn, TileLayerOptions } from 'leaflet';
import { useMap } from '@/components/map/composables/useMap';
import { useEvents } from '@/composables/useEvents';
import { useAttrs } from '@/composables/useAttrs';
import { useLeafletTileLayer } from './composables/useLeafletTileLayer';

export interface Props extends TileLayerOptions {
  url?: string;
}

const props = defineProps<Props>();

const { url } = toRefs(props);
const map = useMap();
const { events, attrs } = useAttrs<LeafletEventHandlerFn>();
const tileLayer = useLeafletTileLayer(map, url, attrs);
useEvents(tileLayer, events);

defineExpose({
  tileLayer
});
</script>

<template>
  <slot></slot>
</template>
