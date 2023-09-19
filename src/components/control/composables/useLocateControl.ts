import { inject, provide, readonly, type Ref } from 'vue';
import type { LocateControlExtension } from 'vue-use-leaflet';
import { locateControlKey } from './injectionSymbols';

export function provideLocateControl(
  control: Ref<LocateControlExtension.Locate | null>
) {
  provide(locateControlKey, readonly(control));
}

export function useLocateControl():
  | Ref<LocateControlExtension.Locate | null>
  | undefined {
  return inject(locateControlKey, undefined);
}
