<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { computed, toRefs, unref, watch } from 'vue';
import { isDef, isDefined } from '@vueuse/shared';
import { useLeafletPane, useLeafletReady } from 'vue-use-leaflet';
import { providePane, useMap } from '.';

export interface Props {
  name: string;
  zIndex?: number;
}

export type Attrs = any;

const props = defineProps<Props>();

const { name, zIndex } = toRefs(props);
const map = useMap();
const { paneElements } = useLeafletPane(map, name, { zIndex: unref(zIndex) });
const paneElement = computed<HTMLElement | null>(
  () => paneElements.value[name.value] ?? null
);
const ready = useLeafletReady(paneElement);

if (isDef(zIndex)) {
  watch(zIndex, val => {
    if (isDefined(paneElement)) {
      const value = isDefined(val) ? `${val}` : 'auto';
      paneElement.value.style.zIndex = value;
    }
  });
}

providePane(paneElement);

defineExpose({
  paneElement
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
