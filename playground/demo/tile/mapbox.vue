<script setup lang="ts">
import {
  VMap,
  VMapAttributionControl,
  VMapMapboxTileLayer,
  VMapZoomControl
} from 'vue-map-ui';
</script>

<template>
  <VMap style="height: 200px">
    <VMapMapboxTileLayer
      title="Mapbox Streets"
      id="streets-v9"
      access-token="pk.eyJ1IjoiYWx0YXJpY2thIiwiYSI6ImNpa3BidXNoaTExMWh1Mm02YTY1ZXlvZXkifQ.fRS4SvpNrcqc7ZFKQSUJxA"
    />
    <VMapZoomControl />
    <VMapAttributionControl />
  </VMap>
</template>
