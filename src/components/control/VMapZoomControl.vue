<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { getCurrentInstance, useAttrs } from 'vue';
import type { Control } from 'leaflet';
import {
  useLeafletZoomControl,
  useLeafletDisplayControl,
  useLeafletReady
} from 'vue-use-leaflet';
import { useMap } from '../map/composables/useMap';
import { pickAttrs, pickProps } from '../../utils/props';
import { provideZoomControl } from './composables/useZoomControl';

export interface Props extends Control.ZoomOptions {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const instance = getCurrentInstance()!;
const {
  refs: { disabled },
  other
} = pickProps(instance, props, ['disabled']);

const map = useMap();
const attrs = useAttrs();
const control = useLeafletZoomControl({
  disabled,
  ...other,
  ...pickAttrs(attrs)
});
const ready = useLeafletReady(control);
useLeafletDisplayControl(map, control);

provideZoomControl(control);

defineExpose({
  zoomControl: control
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>

<style>
@import 'zoom-control';
</style>
