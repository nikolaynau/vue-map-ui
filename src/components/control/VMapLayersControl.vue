<script lang="ts">
import { defineComponent } from 'vue';
import { useVModel } from '@vueuse/core';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { toRefs, reactive } from 'vue';
import type { Control } from 'leaflet';
import {
  useLeafletLayersControl,
  useLeafletDisplayControl,
  useLeafletReady,
  type LayersItemConfig
} from 'vue-use-leaflet';
import { useMap, provideControl, provideApi } from '../../composables';
import { useAttrs } from '../../composables/internal';
import { useLayersControlApi } from './composables/internal/useLayersControlApi';
import { layersControlApiKey } from './utils/injectionSymbols';

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
const layersControl = useLeafletLayersControl(layers, {
  currentBaseLayer,
  currentOverlays,
  indexes: useIndexes.value,
  ...attrs
});
const api = useLayersControlApi(layers);
const ready = useLeafletReady(layersControl);

useLeafletDisplayControl(map, layersControl);
provideControl(layersControl);
provideApi(layersControlApiKey, api);

defineExpose({
  layersControl
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
