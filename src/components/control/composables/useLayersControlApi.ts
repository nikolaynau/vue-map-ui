import { readonly } from 'vue';
import type { MaybeComputedRef } from '@vueuse/shared';
import type { Layer } from 'leaflet';
import type { LayersItemConfig } from 'vue-use-leaflet';

export interface LayersItemIdConfig extends LayersItemConfig {
  id?: string | number;
}

export function useLayersControlApi(layers: LayersItemIdConfig[]) {
  function add(
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

  function remove(id: string | number) {
    const index = layers.findIndex(item => item.id === id);
    if (index > -1) {
      layers.splice(index, 1);
    }
  }

  function getOne(id: string | number): LayersItemIdConfig | undefined {
    return layers.find(item => item.id === id);
  }

  function getAll(): Readonly<LayersItemIdConfig[]> {
    return readonly(layers) as Readonly<LayersItemIdConfig[]>;
  }

  function updateName(id: string | number, value: string | undefined) {
    const entry = getOne(id);
    if (entry) {
      entry.name = value;
    }
  }

  function updateOverlay(id: string | number, value: boolean) {
    const entry = getOne(id);
    if (entry) {
      entry.overlay = value;
    }
  }

  return {
    add,
    remove,
    getOne,
    getAll,
    updateName,
    updateOverlay
  };
}

export type UseLayersControlApiReturn = ReturnType<typeof useLayersControlApi>;
