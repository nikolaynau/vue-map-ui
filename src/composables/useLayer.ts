import { inject, provide, readonly, type Ref } from 'vue';
import type { Layer } from 'leaflet';
import { layerKey } from '../utils/injectionSymbols';

export function provideLayer(layer: Ref<Layer | null>) {
  provide(layerKey, readonly(layer));
}

export function useLayer<T extends Layer = Layer>(): Ref<T | null> {
  return inject(layerKey, undefined) as Ref<T | null>;
}
