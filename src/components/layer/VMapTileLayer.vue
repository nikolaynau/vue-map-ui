<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { watch, useAttrs, unref, onUnmounted, getCurrentInstance } from 'vue';
import type {
  LeafletEvent,
  PopupEvent,
  TileErrorEvent,
  TileEvent,
  TileLayerOptions,
  TooltipEvent
} from 'leaflet';
import {
  useLeafletTileLayer,
  useLeafletDisplayLayer,
  useLeafletReady
} from 'vue-use-leaflet';
import { v4 as uuidv4 } from 'uuid';
import { useApi } from '../../composables/useApi';
import { useProxyEvents } from '../../composables/internal/useProxyEvents';
import { layersControlApiKey } from '../control/composables/injectionSymbols';
import { pickProps, pickAttrs } from '../../utils/props';
import { useMap } from '../map/composables/useMap';
import { provideTileLayer } from './composables/useTileLayer';

export interface Props extends TileLayerOptions {
  url: string | null;
  title?: string;
  overlay?: boolean;
}

export type Emits = {
  (type: 'tileabort', event: TileEvent): void;
  (type: 'loading', event: LeafletEvent): void;
  (type: 'tileunload', event: TileEvent): void;
  (type: 'tileloadstart', event: TileEvent): void;
  (type: 'tileerror', event: TileErrorEvent): void;
  (type: 'tileload', event: TileEvent): void;
  (type: 'load', event: LeafletEvent): void;
  (type: 'add', event: LeafletEvent): void;
  (type: 'remove', event: LeafletEvent): void;
  (type: 'popupopen', event: PopupEvent): void;
  (type: 'popupclose', event: PopupEvent): void;
  (type: 'tooltipopen', event: TooltipEvent): void;
  (type: 'tooltipclose', event: TooltipEvent): void;
};

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  overlay: false
});

const emit = defineEmits<Emits>();

const instance = getCurrentInstance()!;
const {
  refs: { url, title, overlay },
  rest,
  events
} = pickProps(instance, props, ['url', 'title', 'overlay']);

const attrs = useAttrs();
const layer = useLeafletTileLayer(url, Object.assign(rest, pickAttrs(attrs)));
const ready = useLeafletReady(layer);
const controlApi = useApi(layersControlApiKey);

useProxyEvents(layer, events, attrs, emit);

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
  const map = useMap();
  useLeafletDisplayLayer(map, layer);
}

provideTileLayer(layer);

defineExpose({
  tileLayer: layer
});
</script>

<template>
  <slot v-if="ready"></slot>
</template>
