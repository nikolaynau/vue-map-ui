<script setup lang="ts">
import { ref } from 'vue';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import {
  VMap,
  VMapOsmTileLayer,
  VMapIconMarker,
  VMapZoomControl,
  VMapAttributionControl
} from 'vue-map-ui';

const inited = ref(true);
const cssClass = ref('custom-marker-foo');
const iconUrl = ref('/custom/marker-icon.png');
const draggable = ref(false);
const latlng = ref<LatLngExpression>([0, 0]);
const clicked = ref(false);

function onClick(e: LeafletMouseEvent) {
  console.log('Click:', e);
  clicked.value = true;
}

function onChangeIcon() {
  iconUrl.value = '/custom/marker-icon-alt.png';
}

function setClassName() {
  cssClass.value = 'custom-marker-bar';
}
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
    <VMapIconMarker
      v-if="inited"
      v-model:latlng="latlng"
      :draggable="draggable"
      :icon-class="cssClass"
      :icon-url="iconUrl"
      :icon-size="[32, 42]"
      :icon-anchor="[16, 42]"
      @click="onClick"
    />
  </VMap>

  <div class="p-4">
    <button class="block mb-1" @click="onChangeIcon">Change Icon Url</button>
    <button class="block mb-1" @click="inited = !inited">
      Toggle Custom Icon
    </button>
    <button class="block mb-1" @click="setClassName">Set Class Name</button>
    <div>Current Url: {{ iconUrl }}</div>
    <div>Current Class Name: {{ cssClass }}</div>
    <div class="mb-1">Marker Position: {{ latlng }}</div>
    <button class="block mb-1" @click="draggable = !draggable">
      Toggle Draggable: {{ draggable }}
    </button>
    <div>Clicked: {{ clicked }}</div>
  </div>
</template>
