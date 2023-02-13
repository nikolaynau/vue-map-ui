<script setup lang="ts">
import { ref, toRaw, toRefs, useAttrs } from 'vue';
import type {
  MapOptions,
  LatLngBoundsExpression,
  LeafletEvent,
  LatLng,
  LatLngBounds
} from 'leaflet';
import { useLeafletMap } from './composables/useLeafletMap';
import { provideMap } from './composables/useMap';
import { useProxyEvents } from '@/composables/useProxyEvents';
import { getEventTypesFromAttrs } from '@/utils/events';

export interface Props extends MapOptions {
  /**
   * Initial geographic bounds of the map
   */
  bounds?: LatLngBoundsExpression;

  /**
   * Initial center, zoom and bounds use fly methods
   */
  useFly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [0, 0],
  zoom: 0,
  bounds: undefined,
  useFly: false
});

const emit = defineEmits<{
  /**
   * Triggers when moved map view
   * @property {object} data
   */
  (
    e: 'viewport-changed',
    data: { center: LatLng; zoom: number; bounds: LatLngBounds }
  ): void;
  /**
   * Triggers when any event occurs in the leaflet
   * @property {object} data
   */
  (e: string, data: LeafletEvent): void;
}>();

const { center, zoom, bounds, useFly } = toRefs(props);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { useFly: _useFly, bounds: _bounds, ...leafletOptions } = toRaw(props);

const container = ref<HTMLElement | null>(null);
const map = useLeafletMap(container, {
  center,
  zoom,
  bounds,
  useFly,
  leafletOptions
});

const attrs = useAttrs();
useProxyEvents(map, emit, getEventTypesFromAttrs(attrs));

provideMap(map);

defineExpose({
  /**
   * Ref to dom element where the map is created
   */
  container,
  /**
   * Ref to instance of leaflet map
   */
  map
});
</script>

<template>
  <div class="v-map" ref="container">
    <!-- @slot The default slot is used for all map components -->
    <slot></slot>
  </div>
</template>

<style>
@import 'map';
</style>
