<script setup lang="ts">
import { ref } from 'vue';
import { VMap, VMapMarker, VMapOsmTileLayer, VMapIcon } from 'vue-map-ui';

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
    <VMapMarker :latlng="[0, 0]">
      <VMapIcon
        v-if="inited"
        :class="cssClass"
        :icon-url="iconUrl"
        :icon-size="[32, 42]"
        :icon-anchor="[16, 42]"
      />
    </VMapMarker>
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
