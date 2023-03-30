<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import type { Control } from 'leaflet';
import {
  useLeafletDisplayControl,
  useLeafletReady,
  useLeafletScaleControl
} from 'vue-use-leaflet';
import { provideScaleControl } from './composables';
import { useAttrs } from '../../composables';
import { useMap } from '../map';

export type Attrs = Control.ScaleOptions;

const map = useMap();
const { attrs } = useAttrs();
const control = useLeafletScaleControl(attrs);
const ready = useLeafletReady(control);

useLeafletDisplayControl(map, control);
provideScaleControl(control);

defineExpose({
  scaleControl: control
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
