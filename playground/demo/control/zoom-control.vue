<script setup lang="ts">
import { ref } from 'vue';
import {
  VMap,
  VMapAttributionControl,
  VMapOsmTileLayer,
  VMapZoomControl
} from 'vue-map-ui';

const shown = ref(true);
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapZoomControl v-if="shown" />
    <VMapAttributionControl />
  </VMap>

  <div class="p-4">
    <button @click="shown = !shown">Toggle Zoom Control</button>
    <br />
    Shown: {{ shown }}
  </div>
</template>
