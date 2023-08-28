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
  useLeafletAttributionControl,
  useLeafletDisplayControl,
  useLeafletReady
} from 'vue-use-leaflet';
import { pickAttrs, pickProps } from '../../utils/props';
import { useMap } from '../map/composables/useMap';
import { provideAttributionControl } from './composables/useAttributionControl';

export interface Props {
  attributions?: string[];
  prefix?: string | boolean | null;
  position?: ControlPosition;
}

const props = defineProps<Props>();

const instance = getCurrentInstance()!;
const {
  refs: { attributions, prefix },
  other
} = pickProps(instance, props, ['attributions', 'prefix']);

const map = useMap();
const attrs = useAttrs();
const control = useLeafletAttributionControl({
  attributions,
  prefix: prefix as any,
  ...other,
  ...pickAttrs(attrs)
});
const ready = useLeafletReady(control);
useLeafletDisplayControl(map, control);

provideAttributionControl(control);

defineExpose({
  attributionControl: control
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
