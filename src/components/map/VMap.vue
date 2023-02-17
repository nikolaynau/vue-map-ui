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

export interface Props extends MapOptions {
  /**
   * Initial geographic center of the map
   */
  center?: LatLngExpression;

  /**
   * Initial map zoom level
   */
  zoom?: number;

  /**
   * Initial geographic bounds of the map
   */
  bounds?: LatLngBoundsExpression;

  /**
   * Initial center, zoom and bounds use fly methods
   */
  useFly?: boolean;

  /**
   *
   */
  excludeAttrs?: string[];
}

type Emits = {
  /**
   * Triggers when moved map view
   * @property {object} data
   */
  (e: 'view-changed', ev: ViewChangedEvent): void;
  /**
   * Triggers when any event occurs in the leaflet
   * @property {object} data
   */
  (e: string, ev: LeafletEvent): void;
};

const props = withDefaults(defineProps<Props>(), {
  center: () => [0, 0],
  zoom: 0,
  bounds: undefined,
  useFly: false,
  excludeAttrs: undefined
});

const emit = defineEmits<Emits>();

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

const map = useLeafletMap(container, {
  center,
  zoom,
  bounds,
  useFly,
  leafletOptions,
  events: leafletEvents,
  onEvent: onLeafletEvent,
  onViewChanged:
    typeof attrs['onViewChanged'] === 'function' ? onViewChanged : undefined
});

provideMap(map);

function onLeafletEvent(e: LeafletEvent) {
  emit(e.target, e);
}

function onViewChanged(e: ViewChangedEvent) {
  emit('view-changed', e);
}

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
  <div v-bind="containerAttrs" class="v-map" ref="container">
    <!-- @slot The default slot is used for all map components -->
    <slot></slot>
  </div>
</template>

<style>
@import 'map';
</style>
