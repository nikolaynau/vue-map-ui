<script setup lang="ts">
import { ref } from 'vue';
import {
  VMap,
  VMapLayersControl,
  VMapOsmTileLayer,
  VMapMapboxTileLayer,
  VMapArcGisAeroTileLayer,
  VMapArcGisTileLayer,
  VMapOpenTransportTileLayer,
  VMapGoogleTileLayer
} from 'vue-map-ui';

const currentBaseLayer = ref<string | undefined>(undefined);
</script>

<template>
  <VMap style="height: 400px">
    <VMapLayersControl v-model:current-base-layer="currentBaseLayer">
      <VMapOsmTileLayer />
      <VMapMapboxTileLayer
        title="Mapbox Streets"
        id="streets-v9"
        access-token="pk.eyJ1IjoiYWx0YXJpY2thIiwiYSI6ImNpa3BidXNoaTExMWh1Mm02YTY1ZXlvZXkifQ.fRS4SvpNrcqc7ZFKQSUJxA"
      />
      <VMapArcGisTileLayer />
      <VMapArcGisAeroTileLayer />
      <VMapOpenTransportTileLayer api-key="af7fd7de0ed048059413e19e7fb7d90b" />
      <VMapGoogleTileLayer title="Google Streets" />
      <VMapGoogleTileLayer title="Google Hybrid" type="hybrid" />
      <VMapGoogleTileLayer title="Google Terrain" type="terrain" />
      <VMapGoogleTileLayer title="Google Satellite" type="satellite" />
    </VMapLayersControl>
  </VMap>

  <div class="p-4">
    <div>Current Base Layer: {{ currentBaseLayer }}</div>
  </div>
</template>
