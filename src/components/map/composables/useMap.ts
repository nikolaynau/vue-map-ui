import type { Map } from 'leaflet';
import { inject, provide, shallowReadonly, type Ref } from 'vue';
import { mapKey } from '../utils/injectionSymbols';

export function provideMap(map: Ref<Map | null>) {
  provide(mapKey, shallowReadonly(map));
}

export function useMap(): Readonly<Ref<Map | null>> {
  return inject(mapKey, undefined) as Readonly<Ref<Map | null>>;
}
