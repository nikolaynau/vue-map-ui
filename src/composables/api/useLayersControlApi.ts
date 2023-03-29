import { readonly } from 'vue';
import type { MaybeComputedRef } from '@vueuse/shared';
import type { Layer } from 'leaflet';
import type { LayersItemConfig } from 'vue-use-leaflet';

export interface LayersItemIdConfig extends LayersItemConfig {
  id?: string | number;
}

export function useLayersControlApi(layers: LayersItemIdConfig[]) {
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

  function getLayer(id: string | number): LayersItemIdConfig | undefined {
    return layers.find(item => item.id === id);
  }

  function getLayers(): Readonly<LayersItemIdConfig[]> {
    return readonly(layers) as Readonly<LayersItemIdConfig[]>;
  }

  function setName(id: string | number, value: string | undefined) {
    const entry = getLayer(id);
    if (entry) {
      entry.name = value;
    }
  }

  function setOverlay(id: string | number, value: boolean) {
    const entry = getLayer(id);
    if (entry) {
      entry.overlay = value;
    }
  }

  return {
    addLayer,
    removeLayer,
    getLayer,
    getLayers,
    setName,
    setOverlay
  };
}

export type UseLayersControlApiReturn = ReturnType<typeof useLayersControlApi>;
