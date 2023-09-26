<script setup lang="ts">
import { computed, toRefs, watch } from 'vue';
import { isDefined } from '@vueuse/shared';
import { useLeafletPane, useLeafletReady } from 'vue-use-leaflet';
import { useCssClass } from '../../composables/internal/useCssClass';
import { useMap } from './composables/useMap';
import { providePane } from './composables/usePane';

export interface Props {
  name: string;
  zIndex?: number;
  class?: any;
}

defineOptions({
  inheritAttrs: false
});

const props = defineProps<Props>();
const { name, zIndex, class: _class } = toRefs(props);

const map = useMap();
const { paneElements } = useLeafletPane(map, name, { zIndex: zIndex?.value });
const paneElement = computed<HTMLElement | null>(
  () => paneElements.value[name.value] ?? null
);
const ready = useLeafletReady(paneElement);
useCssClass(paneElement, _class);

watch(
  () => zIndex?.value,
  val => {
    if (isDefined(paneElement)) {
      const value = isDefined(val) ? `${val}` : 'auto';
      paneElement.value.style.zIndex = value;
    }
  }
);

providePane(paneElement);

defineExpose({
  paneElement
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
