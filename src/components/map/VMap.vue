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
   * @property {number[]} center the center point
   */
  (e: 'viewport-changed', center: number[]): void;
}>();

const item = ref<number>(0);

function check(text: string): boolean {
  return !!text;
}

defineExpose({
  /**
   * Link to map instance
   */
  ref: ref<number | null>(null),
  /**
   * Check map method
   * @param {string} text Text to check
   * @returns {boolean} Result of checking
   */
  check
});
</script>

<template>
  <div>
    <span>Map: </span>
    <!-- @slot Default slot -->
    <slot></slot>
    <!--
      @slot Tile slot
      @binding {number} item an item passed to the tile
     -->
    <slot name="tile" :item="item"></slot>
  </div>
</template>

<style>
@import 'map';
</style>
