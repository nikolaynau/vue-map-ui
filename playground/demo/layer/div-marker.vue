<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  VMap,
  VMapOsmTileLayer,
  VMapDivMarker,
  VMapZoomControl,
  VMapAttributionControl
} from 'vue-map-ui';

const counter = ref(0);
const html = computed(() => `<div>${counter.value}</div>`);
const inited = ref(true);
const cssClass = ref('custom-marker-foo');

function setClassName() {
  cssClass.value = 'custom-marker-bar';
}

function increment() {
  counter.value++;
}
</script>

<template>
  <VMap style="height: 200px">
    <VMapOsmTileLayer />
    <VMapZoomControl />
    <VMapAttributionControl />
    <VMapDivMarker
      v-if="inited"
      :latlng="[0, 0]"
      :icon-html="html"
      :icon-class="['div-icon-round', cssClass]"
      :icon-class-name="{ 'custom-marker-a': true, 'custom-marker-b': false }"
      :icon-size="[20, 20]"
      :icon-anchor="[10, 20]"
    />
    <VMapDivMarker
      v-if="inited"
      :latlng="[-20, -20]"
      :icon-class="['div-icon-round', cssClass]"
      :icon-size="[20, 20]"
      :icon-anchor="[10, 20]"
    >
      <div class="div-icon-content">{{ counter }}</div>
    </VMapDivMarker>
    <VMapDivMarker
      v-if="inited"
      :latlng="[-40, -20]"
      :icon-class="['div-icon-round', cssClass]"
      :icon-size="[20, 20]"
      :icon-anchor="[10, 20]"
      icon-render-mode="node"
      :icon-root-class="['a', 'b', 'c']"
    >
      <div class="div-icon-content">{{ counter }}</div>
    </VMapDivMarker>
    <VMapDivMarker
      v-if="inited"
      :latlng="[-60, -40]"
      :icon-class="['div-icon-round', cssClass]"
      :icon-size="[20, 20]"
      :icon-anchor="[10, 20]"
      :icon-root-class="['c', 'd']"
      icon-render-mode="portal"
    >
      <div class="div-icon-content">{{ counter }}</div>
    </VMapDivMarker>
    <VMapDivMarker
      v-if="inited"
      :latlng="[-40, -40]"
      :icon-class="['div-icon-round', cssClass]"
      :icon-size="[20, 20]"
      :icon-anchor="[10, 20]"
      icon-render-mode="none"
    >
      <div class="div-icon-content">{{ counter }}</div>
    </VMapDivMarker>
  </VMap>

  <div class="p-4">
    <button class="block mb-1" @click="inited = !inited">
      Toggle Div Icon
    </button>
    <button class="block mb-1" @click="setClassName">Set Class Name</button>
    <button class="block mb-1" @click="increment">Increment Counter</button>
  </div>
</template>

<style>
.div-icon-round {
  background-color: black;
  color: white;
  border-radius: 50%;
  line-height: 20px;
  text-align: center;
}
</style>
