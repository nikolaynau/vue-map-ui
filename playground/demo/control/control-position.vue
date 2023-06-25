<script setup lang="ts">
import { VMap, VMapOsmTileLayer, VMapControlPosition } from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapControlPosition :position="['vside', 'hside']" class="classA" />
  </VMap>
</template>
