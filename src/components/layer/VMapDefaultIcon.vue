<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { onUnmounted, watch, useAttrs, getCurrentInstance } from 'vue';
import type { IconOptions } from 'leaflet';
import { useLeafletDefaultIcon, useLeafletReady } from 'vue-use-leaflet';
import { useApi } from '../../composables/useApi';
import { useMergeCss } from '../../composables/internal/useMergeCss';
import { pickAttrs, pickProps } from '../../utils/props';
import { provideIcon } from './composables/useIcon';
import { markerApiKey } from './composables/injectionSymbols';

export interface Props extends Omit<IconOptions, 'iconUrl'> {
  iconUrl?: string;
  imagePath?: string;
  knownClasses?: string[];
  class?: any;
  className?: any;
}

const props = defineProps<Props>();

const instance = getCurrentInstance()!;
const {
  refs: { iconUrl, imagePath, class: _class, className, knownClasses, ...more },
  other
} = pickProps(instance, props, [
  'iconUrl',
  'imagePath',
  'iconRetinaUrl',
  'iconSize',
  'iconAnchor',
  'shadowUrl',
  'shadowRetinaUrl',
  'shadowSize',
  'shadowAnchor',
  'knownClasses',
  'class',
  'className'
]);

const attrs = useAttrs();
const cssClass = useMergeCss(_class, className);

const icon = useLeafletDefaultIcon({
  iconUrl,
  imagePath: imagePath?.value,
  className: cssClass,
  knownClasses,
  ...more,
  ...other,
  ...pickAttrs(attrs)
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
