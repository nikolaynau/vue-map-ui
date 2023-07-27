<script setup lang="ts">
import { VMap, VMapOsmTileLayer, VMapPinMarker } from 'vue-map-ui';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

library.add(faArrowDown);
</script>

<template>
  <VMap style="height: 200px" :zoom="1">
    <VMapOsmTileLayer />
    <VMapPinMarker :latlng="[0, 0]" />
    <VMapPinMarker
      :latlng="[-25, -20]"
      icon-color="#e74645"
      icon-background-color="#facd60"
      icon-placeholder-color="#fdfa66"
    >
      <FontAwesomeIcon icon="fas fa-arrow-down" />
    </VMapPinMarker>
    <VMapPinMarker :latlng="[-40, 0]" icon-color="#1ac0c6">
      <i class="fa-solid fa-bolt-lightning"></i>
    </VMapPinMarker>
  </VMap>
</template>
