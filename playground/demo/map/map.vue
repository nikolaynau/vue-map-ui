<script setup lang="ts">
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import { ref } from 'vue';
import { VMap, VMapOsmTileLayer } from 'vue-map-ui';
import type { ViewChangedEvent } from 'vue-use-leaflet';

const center = ref<LatLngExpression>([0, 0]);
const zoom = ref(0);
const bounds = ref<LatLngBoundsExpression | undefined>(undefined);

function onViewChanged(e: ViewChangedEvent) {
  center.value = e.center;
  zoom.value = e.zoom;
  bounds.value = e.bounds;
}
</script>

<template>
  <VMap
    style="height: 200px"
    :center="center"
    :zoom="zoom"
    @view-changed="onViewChanged"
  >
    <VMapOsmTileLayer />
  </VMap>

  <div class="p-4">
    Center: {{ center }}
    <br />
    Zoom: {{ zoom }}
    <br />
    Bounds: {{ bounds }}
  </div>
</template>
