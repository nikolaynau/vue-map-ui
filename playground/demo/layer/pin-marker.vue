<script setup lang="ts">
import { VMap, VMapOsmTileLayer, VMapPinMarker } from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapPinMarker :latlng="[0, 0]" />
  </VMap>
</template>
