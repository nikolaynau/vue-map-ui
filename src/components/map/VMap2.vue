<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import {
  getCurrentInstance,
  ref,
  toRef,
  useAttrs,
  camelize,
  type ComponentInternalInstance
} from 'vue';
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
import { useCssClass, useProxyEvents } from '../../composables';
import { ucFirst } from '../../utils/strings';
debugger;
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
const themeCss = useTheme(toRef(props, 'theme'));
const instance = getCurrentInstance()!;
const attrs = useAttrs();
const hasViewChanged = hasEvent(instance, 'view-changed');
const { props: other, events } = propValues(instance, props, {
  omit: ['center', 'zoom', 'bounds', 'useFly']
});

const map = useLeafletMap(container, {
  center: toRef(props, 'center'),
  zoom: toRef(props, 'zoom'),
  bounds: toRef(props, 'bounds'),
  useFly: toRef(props, 'useFly'),
  onViewChanged: hasViewChanged ? e => emit('view-changed', e) : undefined,
  ...other
});

const ready = useLeafletReady(map);
useProxyEvents(map, events, attrs, emit);
useCssClass(container, toRef(props, 'class'));
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

function hasEvent(instance: ComponentInternalInstance, eventName: string) {
  debugger;
  const key = `on${ucFirst(camelize(eventName))}`;
  const { props } = instance.vnode;
  return props && key in props;
}

function propValues<T extends object, K extends keyof T>(
  instance: ComponentInternalInstance,
  props: T,
  options: { omit?: K[] } = {}
): { props: Record<string, unknown>; events: string[] } {
  return { props: {}, events: [] };
}
</script>

<template>
  <div ref="container" class="v-map" :id="id" :style="style">
    <slot v-if="ready"></slot>
  </div>
</template>

<style>
@import 'map';
</style>
