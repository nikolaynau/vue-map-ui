import { inject, provide, readonly, type Ref } from 'vue';
import type { Map } from 'leaflet';
import { mapKey } from './injectionSymbols';

export function provideMap(map: Ref<Map | null>) {
  provide(mapKey, readonly(map) as Ref<Map | null>);
}

export function useMap(throwErrorWhenNullish: boolean = true): Ref<Map | null> {
  const value = inject(mapKey, undefined);
  if (
    throwErrorWhenNullish &&
    value === undefined &&
    import.meta.env.MODE !== 'test'
  ) {
    throw new Error('The top component does not provide a map instance.');
  }
  return value as Ref<Map | null>;
}
