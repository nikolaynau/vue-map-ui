<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { getCurrentInstance, onUnmounted, watch, useAttrs } from 'vue';
import type { IconOptions, PointExpression } from 'leaflet';
import { useLeafletIcon, useLeafletReady } from 'vue-use-leaflet';
import { useApi } from '../../composables/useApi';
import { useMergeCss } from '../../composables/internal/useMergeCss';
import { pickAttrs, pickProps } from '../../utils/props';
import { provideIcon } from './composables/useIcon';
import { markerApiKey } from './composables/injectionSymbols';

export interface Props extends Omit<IconOptions, 'iconUrl'> {
  iconUrl: string | null;
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

const props = defineProps<Props>();

const instance = getCurrentInstance()!;
const {
  refs: { iconUrl, class: _class, className, ...more },
  rest
} = pickProps(instance, props, [
  'iconUrl',
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

const icon = useLeafletIcon(iconUrl, {
  className: cssClass,
  ...more,
  ...rest,
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
