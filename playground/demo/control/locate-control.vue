<script setup lang="ts">
import { ref } from 'vue';
import {
  VMap,
  VMapAttributionControl,
  VMapOsmTileLayer,
  VMapZoomControl,
  VMapLocateControl
} from 'vue-map-ui';
import '@leaflet-extensions/locatecontrol';
import '@leaflet-extensions/locatecontrol/dist/leaflet-locatecontrol.css';

const shown = ref(true);
</script>

<template>
  <VMap style="height: 300px">
    <VMapOsmTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
    <VMapLocateControl v-if="shown" />
  </VMap>

  <div class="p-4">
    <button @click="shown = !shown">Toggle Locate Control</button>
    <br />
    Shown: {{ shown }}
  </div>
</template>
