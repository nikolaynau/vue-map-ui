<script setup lang="ts">
import {
  VMap,
  VMapOsmTileLayer,
  VMapControlPosition,
  VMapZoomControl,
  VMapAttributionControl
} from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
    <VMapControlPosition :position="['vside', 'hside']" class="classA" />
  </VMap>
</template>
