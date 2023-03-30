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
  useLeafletAttributionControl,
  useLeafletDisplayControl,
  useLeafletReady
} from 'vue-use-leaflet';
import { provideAttributionControl } from './composables';
import { useAttrs } from '../../composables';
import { useMap } from '../map';

export interface Props {
  attributions?: string[];
  prefix?: string;
}

export type Attrs = Control.Attribution;

const props = defineProps<Props>();

const { attributions, prefix } = toRefs(props);

const map = useMap();
const { attrs } = useAttrs();
const control = useLeafletAttributionControl({
  attributions,
  prefix,
  ...attrs
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
