<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { LeafletMouseEvent } from 'leaflet';
import {
  VMap,
  VMapAttributionControl,
  VMapOsmTileLayer,
  VMapPinMarker,
  VMapZoomControl
} from 'vue-map-ui';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

library.add(faArrowDown);

const color = ref('');
const colors = reactive([
  '#e74645',
  '#fb7756',
  '#facd60',
  '#fdfa66',
  '#1ac0c6'
]);
const latlng = ref<[number, number]>([-40, 0]);
const draggable = ref(false);
const clicked = ref(false);

function onChangePosition() {
  latlng.value = [-45, -10];
}

function onClick(e: LeafletMouseEvent) {
  console.log('Click:', e);
  clicked.value = true;
}
</script>

<template>
  <VMap style="height: 200px" :zoom="1">
    <VMapOsmTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
    <VMapPinMarker :latlng="[0, 0]" />
    <VMapPinMarker
      :latlng="[-25, -20]"
      icon-color="#e74645"
      icon-background-color="#facd60"
      icon-placeholder-color="#fdfa66"
    >
      <FontAwesomeIcon icon="fas fa-arrow-down" />
    </VMapPinMarker>
    <VMapPinMarker
      v-model:latlng="latlng"
      :draggable="draggable"
      :icon-color="color"
      @click="onClick"
    >
      <i class="fa-solid fa-bolt-lightning"></i>
    </VMapPinMarker>
  </VMap>
  <div class="p-4">
    <div @click="onChangePosition">Change Position</div>
    <div>
      <label
        >Color ({{ color || 'None' }}):
        <select v-model="color">
          <option value="">None</option>
          <option v-for="c in colors" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
    </div>
    <div class="mb-1">Marker Position: {{ latlng }}</div>
    <button class="block mb-1" @click="draggable = !draggable">
      Toggle Draggable: {{ draggable }}
    </button>
    <div>Clicked: {{ clicked }}</div>
  </div>
</template>
