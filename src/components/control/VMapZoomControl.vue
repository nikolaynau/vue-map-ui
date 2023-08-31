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
import type { ExtraControlPosition } from '../../utils/types';
import { provideZoomControl } from './composables/useZoomControl';

export interface Props {
  disabled?: boolean;
  zoomInText?: string;
  zoomInTitle?: string;
  zoomOutText?: string;
  zoomOutTitle?: string;
  position?: ControlPosition | ExtraControlPosition;
}

const props = withDefaults(defineProps<Props>(), {
  position: 'centerright',
  zoomInText: undefined,
  zoomInTitle: undefined,
  zoomOutText: undefined,
  zoomOutTitle: undefined
});

const instance = getCurrentInstance()!;
const {
  refs: { disabled, position },
  rest
} = pickProps(instance, props, ['disabled', 'position']);

const map = useMap();
const attrs = useAttrs();
const control = useLeafletZoomControl({
  disabled,
  position: position.value,
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
