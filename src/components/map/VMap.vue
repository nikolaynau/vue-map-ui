<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { getCurrentInstance, ref, useAttrs } from 'vue';
import type {
  MapOptions,
  LatLngBoundsExpression,
  LatLngExpression,
  LayersControlEvent
} from 'leaflet';
import {
  useLeafletMap,
  useLeafletReady,
  useLeafletControlPosition,
  type ViewChangedEvent
} from 'vue-use-leaflet';
import { useProxyEvents } from '../../composables/internal/useProxyEvents';
import { useCssClass } from '../../composables/internal/useCssClass';
import { hasEvent, pickAttrs, pickProps } from '../../utils/props';
import { useTheme } from './composables/useTheme';
import { provideMap } from './composables/useMap';

export interface Props extends MapOptions {
  center?: LatLngExpression;
  zoom?: number;
  bounds?: LatLngBoundsExpression;
  useFly?: boolean;
  theme?: string | 'light' | 'dark' | 'auto';
  id?: any;
  class?: any;
  style?: any;
}

export type Emits = {
  (type: 'view-changed', event: ViewChangedEvent): void;
  (type: 'baselayerchange', event: LayersControlEvent): void;
};

const props = withDefaults(defineProps<Props>(), {
  center: () => [0, 0],
  zoom: 0,
  bounds: undefined,
  useFly: false,
  theme: 'light',
  id: undefined,
  class: undefined,
  style: undefined
});

const emit = defineEmits<Emits>();

const container = ref<HTMLElement | null>(null);
const instance = getCurrentInstance()!;
const {
  refs: { center, zoom, bounds, useFly, theme, class: cssClass },
  other,
  events
} = pickProps(
  instance,
  props,
  ['center', 'zoom', 'bounds', 'useFly', 'id', 'theme', 'class', 'style'],
  ['view-changed']
);

const attrs = useAttrs();
const hasViewChanged = hasEvent(instance, 'view-changed');

const map = useLeafletMap(container, {
  center,
  zoom,
  bounds,
  useFly,
  onViewChanged: hasViewChanged ? e => emit('view-changed', e) : undefined,
  ...other,
  ...pickAttrs(attrs)
});

const themeCss = useTheme(theme);
const ready = useLeafletReady(map);

useProxyEvents(map, events, attrs, emit);
useCssClass(container, cssClass);
useCssClass(container, themeCss);

useLeafletControlPosition(map, [
  ['center', 'left'],
  ['center', 'right'],
  ['htop', 'left'],
  ['htop', 'right'],
  ['htop', 'center'],
  ['hbottom', 'left'],
  ['hbottom', 'right'],
  ['hbottom', 'center']
]);

provideMap(map);

defineExpose({
  container,
  map
});
</script>

<template>
  <div ref="container" class="v-map" :id="id" :style="style">
    <slot v-if="ready"></slot>
  </div>
</template>

<style>
@import 'map';
</style>
