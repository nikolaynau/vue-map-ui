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
  useLeafletZoomControl,
  useLeafletDisplayControl,
  useLeafletReady
} from 'vue-use-leaflet';
import { provideZoomControl } from './composables';
import { useAttrs } from '../../composables';
import { useMap } from '../map';

export interface Props {
  disabled?: boolean;
}

export type Attrs = Control.ZoomOptions;

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const { disabled } = toRefs(props);

const map = useMap();
const { attrs } = useAttrs();
const control = useLeafletZoomControl({
  disabled,
  ...attrs
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
