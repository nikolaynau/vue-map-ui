<script setup lang="ts">
import { ref } from 'vue';
import type { LatLngExpression } from 'leaflet';
import { VMap, VMapMarker, VMapOsmTileLayer } from 'vue-map-ui';

const latlng = ref<LatLngExpression>([0, 0]);
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapMarker :latlng="latlng" />
  </VMap>

  <div class="p-4">Marker Position: {{ latlng }}</div>
</template>
