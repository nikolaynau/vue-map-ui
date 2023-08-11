<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import type { TileLayer, TileLayerOptions } from 'leaflet';
import { useTemplateRef } from '../../composables/internal/useTemplateRef';
import { pickProps } from '../../utils/props';
import VMapTileLayer from '../layer/VMapTileLayer.vue';

export interface Props extends TileLayerOptions {
  id: string;
  accessToken: string;
  title?: string;
  overlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Mapbox'
});

const instance = getCurrentInstance()!;
const { other } = pickProps(
  instance,
  props,
  ['id', 'accessToken', 'title', 'overlay'],
  [],
  true,
  true
);

const { templateRef, value: tileLayer } = useTemplateRef<
  InstanceType<typeof VMapTileLayer>,
  TileLayer | null
>(obj => obj.tileLayer);

defineExpose({
  tileLayer
});
</script>

<template>
  <VMapTileLayer
    ref="templateRef"
    url="https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
    :id="id"
    :access-token="accessToken"
    :title="title"
    :overlay="overlay"
    v-bind="other"
  >
    <slot></slot>
  </VMapTileLayer>
</template>
