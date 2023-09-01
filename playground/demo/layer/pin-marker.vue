<script setup lang="ts">
import { reactive, ref } from 'vue';
import { VMap, VMapOsmTileLayer, VMapPinMarker } from 'vue-map-ui';
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

function onChangePosition() {
  latlng.value = [-45, -10];
}
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
    <VMapPinMarker :latlng="latlng" :icon-color="color">
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
  </div>
</template>
