<script setup lang="ts">
import { ref } from 'vue';
import {
  VMap,
  VMapAttributionControl,
  VMapOsmTileLayer,
  VMapScaleControl,
  VMapZoomControl
} from 'vue-map-ui';

const shown = ref(true);
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapZoomControl />

    <VMapAttributionControl />
    <VMapScaleControl v-if="shown" />
  </VMap>

  <div class="p-4">
    <button @click="shown = !shown">Toggle Scale Control</button>
    <br />
    Shown: {{ shown }}
  </div>
</template>
