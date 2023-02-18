import type { MaybeReadonlyRef, MaybeRef } from '@vueuse/shared';
import type { Map, TileLayer, TileLayerOptions } from 'leaflet';
import { ref, type Ref } from 'vue';

export type UseTileLayerOptions = TileLayerOptions;

export function useLeafletTileLayer(
  map: MaybeRef<Map | null | undefined>,
  url: MaybeRef<string | null | undefined>,
  options: UseTileLayerOptions = {}
): Ref<TileLayer | null> {
  const tileLayer = ref<TileLayer | null>(null) as Ref<TileLayer | null>;
  return tileLayer;
}

export type UseLeafletTileLayerReturn = ReturnType<typeof useLeafletTileLayer>;
