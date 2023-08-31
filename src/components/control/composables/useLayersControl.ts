import { inject, provide, readonly, type Ref } from 'vue';
import type { Control } from 'leaflet';
import { layersControlKey } from './injectionSymbols';

export function provideLayersControl(control: Ref<Control.Layers | null>) {
  provide(layersControlKey, readonly(control));
}

export function useLayersControl(): Ref<Control.Layers | null> | undefined {
  return inject(layersControlKey, undefined);
}
