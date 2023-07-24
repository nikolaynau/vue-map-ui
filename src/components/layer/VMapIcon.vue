<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { onUnmounted, toRefs, watch } from 'vue';
import type { IconOptions, PointExpression } from 'leaflet';
import { useLeafletIcon, useLeafletReady } from 'vue-use-leaflet';
import { useApi, useAttrs } from '../../composables';
import { provideIcon, markerApiKey } from './composables';

export interface Props {
  iconUrl?: string;
  iconRetinaUrl?: string;
  iconSize?: PointExpression;
  iconAnchor?: PointExpression;
  shadowUrl?: string;
  shadowRetinaUrl?: string;
  shadowSize?: PointExpression;
  shadowAnchor?: PointExpression;
  class?: any;
}

export type Attrs = IconOptions;

const props = defineProps<Props>();

const { iconUrl, class: className, ...options } = toRefs(props);
const { attrs } = useAttrs();

const icon = useLeafletIcon(iconUrl, {
  ...options,
  className,
  ...attrs
});
const ready = useLeafletReady(icon);

const markerApi = useApi(markerApiKey);
if (markerApi) {
  watch(
    icon,
    val => {
      markerApi.setIcon(val);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    markerApi.setIcon(null);
  });
}

provideIcon(icon);

defineExpose({
  icon
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
