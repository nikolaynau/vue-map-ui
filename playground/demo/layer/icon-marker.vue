<script setup lang="ts">
import { ref } from 'vue';
import { VMap, VMapOsmTileLayer, VMapIconMarker } from 'vue-map-ui';

const inited = ref(true);
const cssClass = ref('custom-marker-foo');
const iconUrl = ref('/custom/marker-icon.png');

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
    <VMapIconMarker
      v-if="inited"
      :latlng="[0, 0]"
      :icon-class="cssClass"
      :icon-icon-url="iconUrl"
      :icon-icon-size="[32, 42]"
      :icon-icon-anchor="[16, 42]"
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
  </div>
</template>
