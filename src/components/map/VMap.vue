<script setup lang="ts">
import { ref } from 'vue';

export interface Props {
  /**
   * Initial geographic center of the map
   */
  center?: number[];
}

withDefaults(defineProps<Props>(), {
  center: () => [0, 0]
});

defineEmits<{
  /**
   * Trigger viewport-changed
   * @property center number[]
   */
  (e: 'viewport-changed', center: number[]): void;
}>();

defineExpose({
  /**
   * Leaflet instance
   */
  ref: ref<number | null>(null)
});
</script>

<template>
  <div>
    <span>Map: </span>
    <!--
      @slot Default slot
    -->
    <slot></slot>
    <!--
      @slot Map slot
    -->
    <slot name="map"></slot>
  </div>
</template>
