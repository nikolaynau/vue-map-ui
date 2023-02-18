<script setup lang="ts">
import VMapTileLayer from '@/components/layer/VMapTileLayer.vue';
</script>

<template>
  <VMapTileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    title="Open Street Map"
  />
</template>
