<script setup lang="ts">
import { VMap, VMapLayersControl, VMapGoogleTileLayer } from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 400px">
    <VMapLayersControl>
      <VMapGoogleTileLayer title="Google Streets" />
      <VMapGoogleTileLayer title="Google Hybrid" type="hybrid" />
      <VMapGoogleTileLayer title="Google Terrain" type="terrain" />
      <VMapGoogleTileLayer title="Google Satellite" type="satellite" />
    </VMapLayersControl>
  </VMap>
</template>
