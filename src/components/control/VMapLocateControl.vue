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
  useLeafletLocateControl,
  useLeafletDisplayControl,
  useLeafletReady,
  type LocateControlExtensionOptions
} from 'vue-use-leaflet';
import { useMap } from '../map/composables/useMap';
import { pickAttrs, pickProps } from '../../utils/props';
import type { ExtraControlPosition } from '../../utils/types';
import { provideLocateControl } from './composables/useLocateControl';

export interface Props extends LocateControlExtensionOptions {
  position?: ControlPosition | ExtraControlPosition;
}

const props = withDefaults(defineProps<Props>(), {
  position: 'centerright'
});

const instance = getCurrentInstance()!;
const {
  refs: { position },
  rest
} = pickProps(instance, props, ['position']);

const map = useMap();
const attrs = useAttrs();
const control = useLeafletLocateControl({
  position: position.value,
  ...rest,
  ...pickAttrs(attrs)
});
const ready = useLeafletReady(control);
useLeafletDisplayControl(map, control);

provideLocateControl(control);

defineExpose({
  locateControl: control
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
