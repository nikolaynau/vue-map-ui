import { inject, provide, readonly, type Ref } from 'vue';
import type { Control } from 'leaflet';
import { zoomControlKey } from './injectionSymbols';

export function provideZoomControl(control: Ref<Control.Zoom | null>) {
  provide(zoomControlKey, readonly(control));
}

export function useZoomControl(): Ref<Control.Zoom | null> | undefined {
  return inject(zoomControlKey, undefined);
}
