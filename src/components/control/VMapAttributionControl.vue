<script setup lang="ts">
import { getCurrentInstance, useAttrs } from 'vue';
import type { ControlPosition } from 'leaflet';
import {
  useLeafletAttributionControl,
  useLeafletDisplayControl,
  useLeafletReady
} from 'vue-use-leaflet';
import { pickAttrs, pickProps } from '../../utils/props';
import type { ExtraControlPosition } from '../../utils/types';
import { useMap } from '../map/composables/useMap';
import { provideAttributionControl } from './composables/useAttributionControl';

export interface Props {
  attributions?: string[];
  prefix?: string | boolean | null;
  position?: ControlPosition | ExtraControlPosition;
}

defineOptions({
  inheritAttrs: false
});

const props = withDefaults(defineProps<Props>(), {
  attributions: undefined,
  prefix: undefined,
  position: 'bottomright'
});

const instance = getCurrentInstance()!;
const {
  refs: { attributions, prefix },
  rest
} = pickProps(instance, props, ['attributions', 'prefix']);

const map = useMap();
const attrs = useAttrs();

const control = useLeafletAttributionControl({
  attributions,
  prefix: prefix as any,
  ...rest,
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
