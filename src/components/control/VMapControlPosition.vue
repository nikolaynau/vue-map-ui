<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useLeafletControlPosition, useLeafletReady } from 'vue-use-leaflet';
import { useMap } from '../map/composables/useMap';
import { useCssClass } from '../../composables/internal/useCssClass';
import { provideControlPosition } from './composables/useControlPosition';

export interface Props {
  position?: [string, string];
  class?: any;
}

const props = defineProps<Props>();
const { position, class: cssClass } = toRefs(props);

const map = useMap();
const { positionElements } = useLeafletControlPosition(map, position);

const positionKey = computed(() =>
  Array.isArray(position?.value)
    ? `${position!.value[0]}${position!.value[1]}`
    : undefined
);

const positionElement = computed<HTMLElement | null>(() =>
  positionKey.value ? positionElements.value[positionKey.value] ?? null : null
);
const ready = useLeafletReady(positionElement);
useCssClass(positionElement, cssClass);

provideControlPosition(positionElement);

defineExpose({
  positionElement
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
