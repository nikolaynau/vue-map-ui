<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { getCurrentInstance, useAttrs } from 'vue';
import type { ControlPosition } from 'leaflet';
import {
  useLeafletZoomControl,
  useLeafletDisplayControl,
  useLeafletReady
} from 'vue-use-leaflet';
import { useMap } from '../map/composables/useMap';
import { pickAttrs, pickProps } from '../../utils/props';
import { provideZoomControl } from './composables/useZoomControl';

export interface Props {
  disabled?: boolean;
  zoomInText?: string | undefined;
  zoomInTitle?: string | undefined;
  zoomOutText?: string | undefined;
  zoomOutTitle?: string | undefined;
  position?: ControlPosition | undefined;
}

const props = defineProps<Props>();

const instance = getCurrentInstance()!;
const {
  refs: { disabled },
  rest
} = pickProps(instance, props, ['disabled']);

const map = useMap();
const attrs = useAttrs();
const control = useLeafletZoomControl({
  disabled,
  ...rest,
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
