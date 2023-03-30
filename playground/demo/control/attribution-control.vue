<script setup lang="ts">
import { ref } from 'vue';
import { VMap, VMapOsmTileLayer, VMapAttributionControl } from 'vue-map-ui';

const shown = ref(true);
const prefix = ref<string | undefined>(undefined);
const attributions = ref(['Attribution 1', 'Attribution 2']);
</script>

<template>
  <VMap style="height: 200px" :attribution-control="false">
    <VMapOsmTileLayer attribution="Open Street Map" />
    <VMapAttributionControl
      v-if="shown"
      :prefix="prefix"
      :attributions="attributions"
    />
  </VMap>

  <button @click="shown = !shown">Toggle Attribution Control</button>
  <br />
  Shown: {{ shown }}
  <br />
  Prefix:
  <input type="text" v-model="prefix" class="border px-1 outline-none" />
</template>
