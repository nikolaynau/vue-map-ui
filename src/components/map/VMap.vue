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
  useLeafletReady,
  type ViewChangedEvent
} from 'vue-use-leaflet';
import { provideMap } from './composables';
import { useAttrs, useEvents } from '../../composables';
import { camelizeKeys, omit, pick } from '../../utils/objects';

export interface Props {
  center?: LatLngExpression;
  zoom?: number;
  bounds?: LatLngBoundsExpression;
  useFly?: boolean;
  elementAttrs?: string[];
}

export type Attrs = MapOptions;

const props = withDefaults(defineProps<Props>(), {
  center: () => [0, 0],
  zoom: 0,
  bounds: undefined,
  useFly: false,
  elementAttrs: undefined
});

const { center, zoom, bounds, useFly } = toRefs(props);
const container = ref<HTMLElement | null>(null);
const { events, attrs } = useAttrs<LeafletEventHandlerFn>(false);
const _elementAttrs = [
  ...(props.elementAttrs ?? []),
  ...['id', 'class', 'style']
];
const leafletEvents = omit(events, ['viewChanged']);
const leafletOptions = camelizeKeys(omit(attrs, _elementAttrs));
const elementAttrs = pick(attrs, _elementAttrs);
const onViewChanged = events['viewChanged'] as (e: ViewChangedEvent) => void;

const map = useLeafletMap(container, {
  center,
  zoom,
  bounds,
  useFly,
  ...leafletOptions,
  onViewChanged
});
const ready = useLeafletReady(map);
useEvents(map, leafletEvents);
provideMap(map);

defineExpose({
  container,
  map
});
</script>

<template>
  <div v-bind="elementAttrs" class="v-map" ref="container">
    <slot v-if="ready"></slot>
  </div>
</template>

<style>
@import 'map';
</style>
