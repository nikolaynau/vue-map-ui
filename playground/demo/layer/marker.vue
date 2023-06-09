<script setup lang="ts">
import { ref } from 'vue';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { VMap, VMapMarker, VMapOsmTileLayer } from 'vue-map-ui';

const draggable = ref(false);
const latlng = ref<LatLngExpression>([0, 0]);
const clicked = ref(false);

function onClick(e: LeafletMouseEvent) {
  console.log('Click:', e);
  clicked.value = true;
}
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapMarker
      v-model:latlng="latlng"
      :draggable="draggable"
      @click="onClick"
    />
  </VMap>

  <div class="p-4">
    <div class="mb-1">Marker Position: {{ latlng }}</div>
    <button class="block" @click="draggable = !draggable">
      Toggle Draggable: {{ draggable }}
    </button>
    <div>Clicked: {{ clicked }}</div>
  </div>
</template>
