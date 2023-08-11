<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';
import type { ControlPosition } from 'leaflet';
import {
  useLeafletDisplayControl,
  useLeafletReady,
  useLeafletScaleControl
} from 'vue-use-leaflet';
import { useMap } from '../map/composables/useMap';
import { pickAttrs } from '../../utils/props';
import { provideScaleControl } from './composables/useScaleControl';

export interface Props {
  maxWidth?: number;
  metric?: boolean;
  imperial?: boolean;
  updateWhenIdle?: boolean;
  position?: ControlPosition;
}

const props = defineProps<Props>();

const map = useMap();
const attrs = useAttrs();
const control = useLeafletScaleControl({ ...props, ...pickAttrs(attrs) });
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
