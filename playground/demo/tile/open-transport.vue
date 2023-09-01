<script setup lang="ts">
import {
  VMap,
  VMapAttributionControl,
  VMapOpenTransportTileLayer,
  VMapZoomControl
} from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapOpenTransportTileLayer api-key="af7fd7de0ed048059413e19e7fb7d90b" />
    <VMapZoomControl />
    <VMapAttributionControl />
  </VMap>
</template>
