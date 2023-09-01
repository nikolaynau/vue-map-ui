<script setup lang="ts">
import { ref } from 'vue';
import {
  VMap,
  VMapMarker,
  VMapOsmTileLayer,
  VMapDefaultIcon,
  VMapZoomControl,
  VMapAttributionControl
} from 'vue-map-ui';

const inited = ref(true);
const cssClass = ref('custom-marker-foo');

function setClassName() {
  cssClass.value = 'custom-marker-bar';
}
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
    <VMapMarker :latlng="[0, 0]">
      <VMapDefaultIcon v-if="inited" :class="cssClass" image-path="/" />
    </VMapMarker>
  </VMap>

  <div class="p-4">
    <button class="block mb-1" @click="inited = !inited">
      Toggle Default Icon
    </button>
    <button class="block mb-1" @click="setClassName">Set Class Name</button>
  </div>
</template>
