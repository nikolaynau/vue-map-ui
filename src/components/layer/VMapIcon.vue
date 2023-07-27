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
import { useApi, useAttrs, useMergeCss } from '../../composables';
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
  knownClasses?: string[];
  class?: any;
  className?: any;
}

export type Attrs = IconOptions;

const props = defineProps<Props>();

const { iconUrl, class: _class, className, ...other } = toRefs(props);
const { attrs } = useAttrs();
const cssClass = useMergeCss(_class, className);

const icon = useLeafletIcon(iconUrl, {
  ...other,
  className: cssClass,
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
