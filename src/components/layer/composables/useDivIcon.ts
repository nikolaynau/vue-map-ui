import { inject, provide, readonly, type Ref } from 'vue';
import type { DivIcon } from 'leaflet';
import { divIconKey } from './injectionSymbols';

export function provideDivIcon(divIcon: Ref<DivIcon | null>) {
  provide(divIconKey, readonly(divIcon) as Ref<DivIcon | null>);
}

export function useDivIcon(): Ref<DivIcon | null> | undefined {
  return inject(divIconKey, undefined);
}
