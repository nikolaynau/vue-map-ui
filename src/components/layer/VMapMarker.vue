<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { getCurrentInstance, useAttrs } from 'vue';
import { syncRef, toRef, useVModel } from '@vueuse/core';
import type { DivIcon, Icon, LatLngExpression, MarkerOptions } from 'leaflet';
import {
  useLeafletMarker,
  useLeafletDisplayLayer,
  useLeafletReady
} from 'vue-use-leaflet';
import { provideApi } from '../../composables/useApi';
import { useProxyEvents } from '../../composables/internal/useProxyEvents';
import { useMap } from '../map/composables/useMap';
import { pickAttrs, pickProps } from '../../utils/props';
import { useMarkerApi } from './composables/useMarkerApi';
import { markerApiKey } from './composables/injectionSymbols';
import { provideMarker } from './composables/useMarker';

export interface Props extends MarkerOptions {
  latlng: LatLngExpression | null;
  icon?: Icon | DivIcon;
  opacity?: number;
  zIndexOffset?: number;
  draggable?: boolean;
}

export type Emits = {
  (e: 'update:latlng', value: LatLngExpression): void;
};

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const instance = getCurrentInstance()!;
const {
  refs: { icon, opacity, zIndexOffset, draggable },
  other,
  events
} = pickProps(
  instance,
  props,
  ['latlng', 'icon', 'opacity', 'zIndexOffset', 'draggable'],
  ['update:latlng']
);

const attrs = useAttrs();
const latlng = useVModel(props, 'latlng', emit);
const _icon = toRef<Icon | DivIcon | null | undefined>(null);
syncRef(toRef(icon), _icon, { immediate: true, direction: 'ltr' });

const marker = useLeafletMarker(latlng, {
  icon: _icon,
  opacity,
  zIndexOffset,
  draggable,
  ...other,
  ...pickAttrs(attrs)
});

const map = useMap();
const ready = useLeafletReady(marker);
const api = useMarkerApi({ icon: _icon });
useLeafletDisplayLayer(map, marker);
useProxyEvents(marker, events, attrs, emit);

provideMarker(marker);
provideApi(markerApiKey, api);

defineExpose({
  marker
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
