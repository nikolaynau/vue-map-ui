<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { ref, toRefs, useAttrs } from 'vue';
import type {
  MapOptions,
  LatLngBoundsExpression,
  LeafletEvent,
  LatLngExpression
} from 'leaflet';
import {
  useLeafletMap,
  type ViewChangedEvent
} from './composables/useLeafletMap';
import { provideMap } from './composables/useMap';
import { getEventsFromAttrs, getPropsFromAttrs, getAttrs } from '@/utils/attrs';
import { ucFirst } from '@/utils/strings';

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
const attrs = useAttrs();
const excludeAttrs = [
  ...(props.excludeAttrs ?? []),
  ...['id', 'class', 'style']
];
const leafletEvents = getEventsFromAttrs(attrs, ['viewChanged']);
const leafletOptions = getPropsFromAttrs(attrs, excludeAttrs);
const containerAttrs = getAttrs(attrs, { include: excludeAttrs });
const onViewChanged =
  typeof attrs['onViewChanged'] === 'function'
    ? (attrs['onViewChanged'] as (ev: ViewChangedEvent) => void)
    : undefined;

const map = useLeafletMap(container, {
  center,
  zoom,
  bounds,
  useFly,
  leafletOptions,
  events: leafletEvents,
  onEvent: onLeafletEvent,
  onViewChanged
});

provideMap(map);

function onLeafletEvent(e: LeafletEvent) {
  const key = `on${ucFirst(e.type)}`;
  if (typeof attrs[key] === 'function') {
    (attrs[key] as Function)(e);
  }
}

defineExpose({
  container,
  map
});
</script>

<template>
  <div v-bind="containerAttrs" class="v-map" ref="container">
    <slot></slot>
  </div>
</template>

<style>
@import 'map';
</style>
