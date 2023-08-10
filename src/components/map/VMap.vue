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
import { provideMap } from './composables';
import { useTheme } from './composables/useTheme';
import { useCssClass, useProxyEvents } from '../../composables/internal';
import { hasEvent, pickProps } from '../../utils/props';

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
const hasViewChanged = hasEvent(instance, 'view-changed');
const {
  refs: { center, zoom, bounds, useFly, theme, class: cssClass },
  otherProps,
  events
} = pickProps(
  instance,
  props,
  ['center', 'zoom', 'bounds', 'useFly', 'id', 'theme', 'class', 'style'],
  ['view-changed']
);

const map = useLeafletMap(container, {
  center,
  zoom,
  bounds,
  useFly,
  onViewChanged: hasViewChanged ? e => emit('view-changed', e) : undefined,
  ...otherProps
});

const themeCss = useTheme(theme);
const ready = useLeafletReady(map);
const attrs = useAttrs();
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
