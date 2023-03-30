import { inject, provide, readonly, type Ref } from 'vue';
import type { TileLayer } from 'leaflet';
import { tileLayerKey } from './injectionSymbols';

export function provideTileLayer(tileLayer: Ref<TileLayer | null>) {
  provide(tileLayerKey, readonly(tileLayer));
}

export function useTileLayer(): Ref<TileLayer | null> {
  return inject(tileLayerKey, undefined) as Ref<TileLayer | null>;
}
