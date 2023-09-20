import { inject, provide, readonly, type Ref } from 'vue';
import type { LocateControlExtension } from 'vue-use-leaflet';
import { locateControlKey } from './injectionSymbols';

export function provideLocateControl(
  control: Ref<LocateControlExtension | null>
) {
  provide(locateControlKey, readonly(control));
}

export function useLocateControl():
  | Ref<LocateControlExtension | null>
  | undefined {
  return inject(locateControlKey, undefined);
}
