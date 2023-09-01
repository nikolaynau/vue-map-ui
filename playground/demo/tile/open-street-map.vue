<script setup lang="ts">
import {
  VMap,
  VMapAttributionControl,
  VMapOsmTileLayer,
  VMapZoomControl
} from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
  </VMap>
</template>
