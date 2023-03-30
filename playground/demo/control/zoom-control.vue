<script setup lang="ts">
import { ref } from 'vue';
import { VMap, VMapOsmTileLayer, VMapZoomControl } from 'vue-map-ui';

const shown = ref(true);
</script>

<template>
  <VMap style="height: 200px" :zoom-control="false">
    <VMapOsmTileLayer />
    <VMapZoomControl v-if="shown" />
  </VMap>

  <button @click="shown = !shown">Toggle Zoom Control</button>
  <br />
  Shown: {{ shown }}
</template>
