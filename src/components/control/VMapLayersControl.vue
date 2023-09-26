<script setup lang="ts">
import { reactive, useAttrs, getCurrentInstance } from 'vue';
import type { ControlPosition, Layer } from 'leaflet';
import { useVModel } from '@vueuse/core';
import {
  useLeafletLayersControl,
  useLeafletDisplayControl,
  useLeafletReady,
  type LayersItemConfig
} from 'vue-use-leaflet';
import { provideApi } from '../../composables/useApi';
import { useMap } from '../map/composables/useMap';
import { pickAttrs, pickProps } from '../../utils/props';
import type { ExtraControlPosition } from '../../utils/types';
import { provideLayersControl } from './composables/useLayersControl';
import { layersControlApiKey } from './composables/injectionSymbols';
import { useLayersControlApi } from './composables/useLayersControlApi';

export interface Props {
  currentBaseLayer?: string | number;
  currentOverlays?: string[] | number[];
  useIndexes?: boolean;
  collapsed?: boolean;
  autoZIndex?: boolean;
  hideSingleBase?: boolean;
  sortLayers?: boolean;
  sortFunction?: (
    layerA: Layer,
    layerB: Layer,
    nameA: string,
    nameB: string
  ) => number;
  position?: ControlPosition | ExtraControlPosition;
}

defineOptions({
  inheritAttrs: false
});

const props = withDefaults(defineProps<Props>(), {
  currentBaseLayer: 0,
  currentOverlays: undefined,
  useIndexes: false,
  sortFunction: undefined,
  position: undefined
});

const emit = defineEmits<{
  (type: 'update:currentBaseLayer', value: string | number): void;
  (type: 'update:currentOverlays', value: string[] | number[]): void;
}>();

const instance = getCurrentInstance()!;
const {
  refs: { useIndexes },
  rest
} = pickProps(instance, props, [
  'currentBaseLayer',
  'currentOverlays',
  'useIndexes'
]);

const layers: LayersItemConfig[] = reactive([]);
const currentBaseLayer = useVModel(props, 'currentBaseLayer', emit);
const currentOverlays = useVModel(props, 'currentOverlays', emit);

const map = useMap();
const attrs = useAttrs();
const control = useLeafletLayersControl(layers, {
  currentBaseLayer,
  currentOverlays,
  indexes: useIndexes.value,
  ...rest,
  ...pickAttrs(attrs)
});

const api = useLayersControlApi(layers);
const ready = useLeafletReady(control);
useLeafletDisplayControl(map, control);

provideLayersControl(control);
provideApi(layersControlApiKey, api);

defineExpose({
  layersControl: control
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
