import { inject, provide, readonly, type Ref } from 'vue';
import type { TileLayer } from 'leaflet';
import { tileLayerKey } from './injectionSymbols';

export function provideTileLayer(tileLayer: Ref<TileLayer | null>) {
  provide(tileLayerKey, readonly(tileLayer) as Ref<TileLayer | null>);
}

export function useTileLayer(): Ref<TileLayer | null> | undefined {
  return inject(tileLayerKey, undefined);
}
