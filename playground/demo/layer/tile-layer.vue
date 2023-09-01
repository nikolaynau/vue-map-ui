<script setup lang="ts">
import {
  VMap,
  VMapAttributionControl,
  VMapTileLayer,
  VMapZoomControl
} from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <VMapZoomControl />
    <VMapAttributionControl />
  </VMap>
</template>
