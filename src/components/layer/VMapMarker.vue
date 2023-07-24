<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { toRefs } from 'vue';
import { syncRef, toRef, useVModel } from '@vueuse/core';
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
import { provideApi, useAttrs, useEvents } from '../../composables';
import { useMap } from '../map';
import { useMarkerApi } from './composables/useMarkerApi';
import { markerApiKey, provideMarker } from './composables';

export interface Props {
  latlng?: LatLngExpression;
  icon?: Icon | DivIcon;
  opacity?: number;
  zIndexOffset?: number;
  draggable?: boolean;
}

export type Attrs = MarkerOptions;

export type Emits = {
  (e: 'update:latlng', value: LatLngExpression): void;
};

const props = withDefaults(defineProps<Props>(), {
  latlng: undefined,
  icon: undefined,
  opacity: undefined,
  zIndexOffset: undefined,
  draggable: undefined
});

const emit = defineEmits<Emits>();

const { opacity, icon, zIndexOffset, draggable } = toRefs(props);
const _icon = toRef<Icon | DivIcon | null | undefined>(null);
const { events, attrs } = useAttrs<LeafletEventHandlerFn>();
const latlng = useVModel(props, 'latlng', emit);
const marker = useLeafletMarker(latlng, {
  icon: _icon,
  opacity,
  zIndexOffset,
  draggable,
  ...attrs
});

const ready = useLeafletReady(marker);
const api = useMarkerApi({ icon });
const map = useMap();
useLeafletDisplayLayer(map, marker);
useEvents(marker, events);

syncRef(icon, _icon, { immediate: true, direction: 'ltr' });

provideMarker(marker);
provideApi(markerApiKey, api);

defineExpose({
  marker
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
