<script setup lang="ts">
import { ref } from 'vue';
import { VMap, VMapOsmTileLayer, VMapLayersControl } from 'vue-map-ui';

const currentBaseLayer = ref<string | undefined>(undefined);
</script>

<template>
  <VMap style="height: 200px">
    <VMapLayersControl v-model:current-base-layer="currentBaseLayer">
      <VMapOsmTileLayer />
    </VMapLayersControl>
  </VMap>
  <div>Current Base Layer: {{ currentBaseLayer }}</div>
</template>
