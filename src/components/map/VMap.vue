<script setup lang="ts">
import { ref, markRaw, toRaw, onMounted } from 'vue';
import { type MapOptions, type LatLngBoundsExpression, Map } from 'leaflet';

export interface Props extends MapOptions {
  /**
   * Initial geographic bounds of the map. The fitBounds method is called to set the bounds.
   */
  bounds?: LatLngBoundsExpression;

  /**
   * Initial center, zoom and bounds use fly methods
   */
  useFly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [0, 0],
  zoom: 0
});

defineEmits<{
  /**
   * Trigger viewport-changed
   * @property {number[]} center the center point
   */
  (e: 'viewport-changed', center: number[]): void;
}>();

const map = ref<Map | null>(null);
const container = ref<HTMLElement | null>(null);

onMounted(() => {
  if (container.value) {
    const { bounds: _bounds, useFly: _useFly, ...leafletMapOptions } = toRaw;
    map.value = markRaw(new Map(container.value, {}));
  }
});

defineExpose({
  container,
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
