<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type {
  MapOptions,
  LatLngBoundsExpression,
  LatLngExpression,
  LeafletEventHandlerFn
} from 'leaflet';
import {
  useLeafletMap,
  type ViewChangedEventHandler
} from './composables/useLeafletMap';
import { provideMap } from './composables/useMap';
import { omit, pick } from '@/utils/objects';
import { useAttrs } from '@/composables/useAttrs';
import { useEvents } from '@/composables/useEvents';

export interface Props extends MapOptions {
  center?: LatLngExpression;
  zoom?: number;
  bounds?: LatLngBoundsExpression;
  useFly?: boolean;
  excludeAttrs?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [0, 0],
  zoom: 0,
  bounds: undefined,
  useFly: false,
  excludeAttrs: undefined
});

const { center, zoom, bounds, useFly } = toRefs(props);
const container = ref<HTMLElement | null>(null);
const { events, attrs } = useAttrs<LeafletEventHandlerFn>();
const excludeAttrs = [
  ...(props.excludeAttrs ?? []),
  ...['id', 'class', 'style']
];
const leafletEvents = omit(events, ['viewChanged']);
const leafletOptions = omit(attrs, excludeAttrs);
const elementAttrs = pick(attrs, excludeAttrs);
const onViewChanged = events['viewChanged'] as ViewChangedEventHandler;
const map = useLeafletMap(container, {
  center,
  zoom,
  bounds,
  useFly,
  leafletOptions,
  onViewChanged
});
useEvents(map, leafletEvents);
provideMap(map);

defineExpose({
  container,
  map
});
</script>

<template>
  <div v-bind="elementAttrs" class="v-map" ref="container">
    <slot></slot>
  </div>
</template>

<style>
@import 'map';
</style>
