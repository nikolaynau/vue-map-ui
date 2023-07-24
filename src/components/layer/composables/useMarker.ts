import { inject, provide, readonly, type Ref } from 'vue';
import type { Marker } from 'leaflet';
import { markerKey } from './injectionSymbols';

export function provideMarker(marker: Ref<Marker | null>) {
  provide(markerKey, readonly(marker) as Ref<Marker | null>);
}

export function useMarker(): Ref<Marker | null> | undefined {
  return inject(markerKey, undefined);
}
