import type { Map } from 'leaflet';
import { inject, provide, readonly, type Ref } from 'vue';
import { mapKey } from '../utils/injectionSymbols';

export function provideMap(map: Ref<Map | null>) {
  provide(mapKey, readonly(map));
}

export function useMap(): Ref<Map | null> {
  return inject(mapKey, undefined) as Ref<Map | null>;
}
