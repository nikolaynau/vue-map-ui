<script setup lang="ts">
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import { ref } from 'vue';
//import { VMap, VMapOsmTileLayer } from 'vue-map-ui';
import type { ViewChangedEvent } from 'vue-use-leaflet';
import VMap2 from '../../../src/components/map/VMap2.vue';

const center = ref<LatLngExpression>([0, 0]);
const zoom = ref(0);
const bounds = ref<LatLngBoundsExpression | undefined>(undefined);
const theme = ref<string | undefined>('light');

function onViewChanged(e: ViewChangedEvent) {
  center.value = e.center;
  zoom.value = e.zoom;
  bounds.value = e.bounds;
}
</script>

<template>
  <!--<VMap
    style="height: 200px"
    :center="center"
    :zoom="zoom"
    :theme="theme"
    @view-changed="onViewChanged"
  >
    <VMapOsmTileLayer />
  </VMap>-->
  <VMap2
    style="height: 200px"
    :center="center"
    :zoom="zoom"
    :theme="theme"
    test-A
    foo-bar
    barFoo
    Bar-Bar
    @foo-bar="null"
    @fooBarBar="null"
    @FooBar="null"
    on
    scroll-wheel-zoom="center"
    :zoom-animation-threshold="2"
    @view-changed="onViewChanged"
  >
    <!--<VMapOsmTileLayer />-->
  </VMap2>

  <div class="p-4">
    Center: {{ center }}
    <br />
    Zoom: {{ zoom }}
    <br />
    Bounds: {{ bounds }}
  </div>
  <div class="px-4">
    Theme:
    <select v-model="theme">
      <option value="auto">Auto</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </div>
</template>
