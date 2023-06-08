<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { toRefs } from 'vue';
import type {
  DivIcon,
  Icon,
  LatLngExpression,
  LeafletEventHandlerFn,
  MarkerOptions
} from 'leaflet';
import {
  useLeafletMarker,
  useLeafletDisplayLayer,
  useLeafletReady
} from 'vue-use-leaflet';
import { useAttrs, useEvents } from '../../composables';
import { useMap } from '../map';
import { provideMarker } from './composables';

export interface Props {
  latlng?: LatLngExpression;
  icon?: Icon | DivIcon;
  opacity?: number;
  zIndexOffset?: number;
  draggable?: boolean;
}

export type Attrs = MarkerOptions;

const props = withDefaults(defineProps<Props>(), {
  latlng: undefined,
  icon: undefined,
  opacity: undefined,
  zIndexOffset: undefined,
  draggable: undefined
});

const { latlng, opacity, icon, zIndexOffset, draggable } = toRefs(props);
const map = useMap();
const { events, attrs } = useAttrs<LeafletEventHandlerFn>();
const marker = useLeafletMarker(latlng, {
  icon,
  opacity,
  zIndexOffset,
  draggable,
  ...attrs
});
const ready = useLeafletReady(marker);
useLeafletDisplayLayer(map, marker);
useEvents(marker, events);
provideMarker(marker);

defineExpose({
  marker
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>