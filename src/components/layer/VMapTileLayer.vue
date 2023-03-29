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
import { useMap, provideLayer, useApi } from '../../composables';
import { useAttrs, useEvents } from '../../composables/internal';
import { apiKeys } from '../../utils/injectionSymbols';

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
const tileLayer = useLeafletTileLayer(url, attrs);
const ready = useLeafletReady(tileLayer);
const api = useApi(apiKeys.layersControlKey);

if (api) {
  const uid = uuidv4();
  api.add(uid, unref(title), tileLayer, unref(overlay));

  watch(title, val => {
    api.updateName(uid, val);
  });

  watch(overlay, val => {
    api.updateOverlay(uid, val);
  });

  onUnmounted(() => {
    api.remove(uid);
  });
} else {
  useLeafletDisplayLayer(map, tileLayer);
}

useEvents(tileLayer, events);
provideLayer(tileLayer);

defineExpose({
  tileLayer
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
