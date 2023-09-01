<script setup lang="ts">
import {
  VMap,
  VMapArcGisTileLayer,
  VMapAttributionControl,
  VMapZoomControl
} from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapArcGisTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
  </VMap>
</template>
