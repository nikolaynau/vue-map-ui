import { readonly } from 'vue';
import type { MaybeComputedRef } from '@vueuse/shared';
import type { Layer } from 'leaflet';
import type { LayersItemConfig } from 'vue-use-leaflet';

export interface UniqLayersItemConfig extends LayersItemConfig {
  id?: string | number;
}

export function useLayersControlApi(layers: UniqLayersItemConfig[]) {
  function addLayer(
    id: string | number,
    name: string | undefined,
    layer: MaybeComputedRef<Layer | null | undefined>,
    overlay?: boolean
  ) {
    layers.push({
      id,
      name,
      layer,
      overlay
    });
  }

  function removeLayer(id: string | number) {
    const index = layers.findIndex(item => item.id === id);
    if (index > -1) {
      layers.splice(index, 1);
    }
  }

  function getLayer(id: string | number): UniqLayersItemConfig | undefined {
    return layers.find(item => item.id === id);
  }

  function getLayers(): Readonly<UniqLayersItemConfig[]> {
    return readonly(layers) as Readonly<UniqLayersItemConfig[]>;
  }

  return {
    addLayer,
    removeLayer,
    getLayer,
    getLayers
  };
}

export type UseLayersControlApiReturn = ReturnType<typeof useLayersControlApi>;
