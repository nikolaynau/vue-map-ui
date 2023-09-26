<script setup lang="ts">
import { useAttrs, getCurrentInstance } from 'vue';
import type { ControlPosition } from 'leaflet';
import {
  useLeafletDisplayControl,
  useLeafletReady,
  useLeafletScaleControl
} from 'vue-use-leaflet';
import { useMap } from '../map/composables/useMap';
import { pickAttrs, pickProps } from '../../utils/props';
import type { ExtraControlPosition } from '../../utils/types';
import { provideScaleControl } from './composables/useScaleControl';
import { useModernScale } from './composables/useModernScale';

export interface Props {
  maxWidth?: number;
  metric?: boolean;
  imperial?: boolean;
  updateWhenIdle?: boolean;
  position?: ControlPosition | ExtraControlPosition;
}

defineOptions({
  inheritAttrs: false
});

const props = withDefaults(defineProps<Props>(), {
  maxWidth: undefined,
  imperial: false,
  position: 'bottomright'
});

const instance = getCurrentInstance()!;
const {
  refs: { position, imperial },
  rest
} = pickProps(instance, props, ['position', 'imperial']);

const map = useMap();
const attrs = useAttrs();
const control = useLeafletScaleControl({
  position: position.value,
  imperial: imperial.value,
  ...rest,
  ...pickAttrs(attrs)
});
useModernScale(control);
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

<style>
@import 'scale-control';
</style>
