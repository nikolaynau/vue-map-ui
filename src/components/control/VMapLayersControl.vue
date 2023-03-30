<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { toRefs, reactive } from 'vue';
import type { Control } from 'leaflet';
import { useVModel } from '@vueuse/core';
import {
  useLeafletLayersControl,
  useLeafletDisplayControl,
  useLeafletReady,
  type LayersItemConfig
} from 'vue-use-leaflet';

import { useAttrs, provideApi } from '../../composables';
import { provideLayersControl, layersControlApiKey } from './composables';
import { useLayersControlApi } from './composables/useLayersControlApi';
import { useMap } from '../map';

export interface Props {
  currentBaseLayer?: string | number;
  currentOverlays?: string[] | number[];
  useIndexes?: boolean;
}

export type Attrs = Control.LayersOptions;

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

const { useIndexes } = toRefs(props);

const layers: LayersItemConfig[] = reactive([]);
const currentBaseLayer = useVModel(props, 'currentBaseLayer', emit);
const currentOverlays = useVModel(props, 'currentOverlays', emit);

const map = useMap();
const { attrs } = useAttrs();
const control = useLeafletLayersControl(layers, {
  currentBaseLayer,
  currentOverlays,
  indexes: useIndexes.value,
  ...attrs
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