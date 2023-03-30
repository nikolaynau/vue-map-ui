<script setup lang="ts">
import { ref } from 'vue';
import { VMap, VMapOsmTileLayer, VMapScaleControl } from 'vue-map-ui';

const shown = ref(true);
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapScaleControl v-if="shown" />
  </VMap>

  <button @click="shown = !shown">Toggle Scale Control</button>
  <br />
  Shown: {{ shown }}
</template>
