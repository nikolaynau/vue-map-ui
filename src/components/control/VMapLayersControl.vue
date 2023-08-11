<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { reactive, useAttrs, getCurrentInstance } from 'vue';
import type { Control } from 'leaflet';
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
import { provideLayersControl } from './composables/useLayersControl';
import { layersControlApiKey } from './composables/injectionSymbols';
import { useLayersControlApi } from './composables/useLayersControlApi';

export interface Props extends Control.LayersOptions {
  currentBaseLayer?: string | number;
  currentOverlays?: string[] | number[];
  useIndexes?: boolean;
}

export type Emits = {
  (e: 'update:currentBaseLayer', value: string | number): void;
  (e: 'update:currentOverlays', value: string[] | number[]): void;
};

const props = withDefaults(defineProps<Props>(), {
  currentBaseLayer: 0,
  currentOverlays: undefined,
  useIndexes: false
});

const emit = defineEmits<Emits>();

const instance = getCurrentInstance()!;
const {
  refs: { useIndexes },
  other
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
  ...other,
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
