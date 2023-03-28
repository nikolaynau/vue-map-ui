<script setup lang="ts">
import { VMap, VMapOsmTileLayer, VMapLayersControl } from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapLayersControl>
      <VMapOsmTileLayer />
    </VMapLayersControl>
  </VMap>
</template>
