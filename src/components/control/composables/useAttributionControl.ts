import { inject, provide, readonly, type Ref } from 'vue';
import type { Control } from 'leaflet';
import { attributionControlKey } from './injectionSymbols';

export function provideAttributionControl(
  control: Ref<Control.Attribution | null>
) {
  provide(attributionControlKey, readonly(control));
}

export function useAttributionControl():
  | Ref<Control.Attribution | null>
  | undefined {
  return inject(attributionControlKey, undefined);
}
