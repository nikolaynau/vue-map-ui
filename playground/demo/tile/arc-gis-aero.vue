<script setup lang="ts">
import {
  VMap,
  VMapArcGisAeroTileLayer,
  VMapAttributionControl,
  VMapZoomControl
} from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapArcGisAeroTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
  </VMap>
</template>
