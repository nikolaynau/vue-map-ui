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
  LayersControlEvent,
  LayerEvent,
  LeafletEvent,
  ResizeEvent,
  LeafletKeyboardEvent,
  LeafletMouseEvent,
  LocationEvent,
  PopupEvent,
  TooltipEvent,
  ZoomAnimEvent
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
  (type: 'overlayadd', event: LayersControlEvent): void;
  (type: 'overlayremove', event: LayersControlEvent): void;
  (type: 'layeradd', event: LayerEvent): void;
  (type: 'layerremove', event: LayerEvent): void;
  (type: 'zoomlevelschange', event: LeafletEvent): void;
  (type: 'resize', event: ResizeEvent): void;
  (type: 'unload', event: LeafletEvent): void;
  (type: 'viewreset', event: LeafletEvent): void;
  (type: 'load', event: LeafletEvent): void;
  (type: 'zoomstart', event: LeafletEvent): void;
  (type: 'movestart', event: LeafletEvent): void;
  (type: 'zoom', event: LeafletEvent): void;
  (type: 'move', event: LeafletEvent): void;
  (type: 'zoomend', event: LeafletEvent): void;
  (type: 'moveend', event: LeafletEvent): void;
  (type: 'popupopen', event: PopupEvent): void;
  (type: 'popupclose', event: PopupEvent): void;
  (type: 'autopanstart', event: LeafletEvent): void;
  (type: 'tooltipopen', event: TooltipEvent): void;
  (type: 'tooltipclose', event: TooltipEvent): void;
  (type: 'locationerror', event: ErrorEvent): void;
  (type: 'locationfound', event: LocationEvent): void;
  (type: 'click', event: LeafletMouseEvent): void;
  (type: 'dblclick', event: LeafletMouseEvent): void;
  (type: 'mousedown', event: LeafletMouseEvent): void;
  (type: 'mouseup', event: LeafletMouseEvent): void;
  (type: 'mouseover', event: LeafletMouseEvent): void;
  (type: 'mouseout', event: LeafletMouseEvent): void;
  (type: 'mousemove', event: LeafletMouseEvent): void;
  (type: 'contextmenu', event: LeafletMouseEvent): void;
  (type: 'keypress', event: LeafletKeyboardEvent): void;
  (type: 'keydown', event: LeafletKeyboardEvent): void;
  (type: 'keyup', event: LeafletKeyboardEvent): void;
  (type: 'preclick', event: LeafletMouseEvent): void;
  (type: 'zoomanim', event: ZoomAnimEvent): void;
};

const props = withDefaults(defineProps<Props>(), {
  center: () => [0, 0],
  zoom: 0,
  bounds: undefined,
  useFly: false,
  theme: 'light',
  id: undefined,
  class: undefined,
  style: undefined,
  zoomControl: false,
  attributionControl: false
});

const emit = defineEmits<Emits>();

const container = ref<HTMLElement | null>(null);
const instance = getCurrentInstance()!;
const {
  refs: {
    center,
    zoom,
    bounds,
    useFly,
    theme,
    class: cssClass,
    zoomControl,
    attributionControl
  },
  rest,
  events
} = pickProps(
  instance,
  props,
  [
    'center',
    'zoom',
    'bounds',
    'useFly',
    'id',
    'theme',
    'class',
    'style',
    'zoomControl',
    'attributionControl'
  ],
  ['view-changed']
);

const attrs = useAttrs();
const hasViewChanged = hasEvent(instance, 'view-changed');

const map = useLeafletMap(container, {
  center,
  zoom,
  bounds,
  useFly,
  zoomControl: zoomControl.value,
  attributionControl: attributionControl.value,
  onViewChanged: hasViewChanged ? e => emit('view-changed', e) : undefined,
  ...rest,
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
