<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { Control } from 'leaflet';
import {
  useLeafletLayersControl,
  useLeafletDisplayControl,
  useLeafletReady
} from 'vue-use-leaflet';
import { useMap, useAttrs, provideControl } from '../../composables';

export interface Props {
  currentBaseLayer?: string | number;
  currentOverlays?: string[] | number[];
}

export type Attrs = Control.LayersOptions;

const props = defineProps<Props>();

const { currentBaseLayer, currentOverlays } = toRefs(props);
const baseLayers;

const map = useMap();
const { attrs } = useAttrs();
const layersControl = useLeafletLayersControl(url, attrs);
const ready = useLeafletReady(layersControl);

useLeafletDisplayControl(map, layersControl);
provideControl(layersControl);

defineExpose({
  layersControl
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
