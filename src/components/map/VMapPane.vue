<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { computed, toRefs, watch } from 'vue';
import { isDefined } from '@vueuse/shared';
import { useLeafletPane, useLeafletReady } from 'vue-use-leaflet';
import { useCssClass } from '../../composables';
import { providePane, useMap } from './composables';

export interface Props {
  name: string;
  zIndex?: number;
  class?: any;
}

export type Attrs = any;

const props = defineProps<Props>();
const { name, class: _class } = toRefs(props);

const map = useMap();
const { paneElements } = useLeafletPane(map, name, { zIndex: props.zIndex });
const paneElement = computed<HTMLElement | null>(
  () => paneElements.value[name.value] ?? null
);
const ready = useLeafletReady(paneElement);
useCssClass(paneElement, _class);

watch(
  () => props.zIndex,
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
