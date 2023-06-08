<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { watch, toRefs, unref, onUnmounted } from 'vue';
import type { LeafletEventHandlerFn, TileLayerOptions } from 'leaflet';
import {
  useLeafletTileLayer,
  useLeafletDisplayLayer,
  useLeafletReady
} from 'vue-use-leaflet';
import { v4 as uuidv4 } from 'uuid';
import { provideTileLayer } from './composables';
import { useAttrs, useEvents, useApi } from '../../composables';
import { layersControlApiKey } from '../control';
import { useMap } from '../map';

export interface Props {
  url?: string;
  title?: string;
  overlay?: boolean;
}

export type Attrs = TileLayerOptions;

const props = withDefaults(defineProps<Props>(), {
  url: undefined,
  title: undefined,
  overlay: false
});

const { url, title, overlay } = toRefs(props);
const map = useMap();
const { events, attrs } = useAttrs<LeafletEventHandlerFn>();
const layer = useLeafletTileLayer(url, attrs);
const ready = useLeafletReady(layer);
const controlApi = useApi(layersControlApiKey);

if (controlApi) {
  const id = uuidv4();
  controlApi.add(id, unref(title), layer, unref(overlay));

  watch(title, val => {
    controlApi.updateName(id, val);
  });

  watch(overlay, val => {
    controlApi.updateOverlay(id, val);
  });

  onUnmounted(() => {
    controlApi.remove(id);
  });
} else {
  useLeafletDisplayLayer(map, layer);
}

useEvents(layer, events);
provideTileLayer(layer);

defineExpose({
  tileLayer: layer
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
