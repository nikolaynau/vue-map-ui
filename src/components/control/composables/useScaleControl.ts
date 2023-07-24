import { inject, provide, readonly, type Ref } from 'vue';
import type { Control } from 'leaflet';
import { scaleControlKey } from './injectionSymbols';

export function provideScaleControl(control: Ref<Control.Scale | null>) {
  provide(scaleControlKey, readonly(control));
}

export function useScaleControl(): Ref<Control.Scale | null> | undefined {
  return inject(scaleControlKey, undefined);
}
