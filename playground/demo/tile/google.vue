<script setup lang="ts">
import {
  VMap,
  VMapLayersControl,
  VMapGoogleTileLayer,
  VMapZoomControl,
  VMapAttributionControl
} from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapLayersControl>
      <VMapGoogleTileLayer title="Google Streets" />
      <VMapGoogleTileLayer title="Google Hybrid" type="hybrid" />
      <VMapGoogleTileLayer title="Google Terrain" type="terrain" />
      <VMapGoogleTileLayer title="Google Satellite" type="satellite" />
    </VMapLayersControl>
    <VMapZoomControl />
    <VMapAttributionControl />
  </VMap>
</template>
