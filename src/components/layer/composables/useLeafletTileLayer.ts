import { ref, unref, watch, type Ref, shallowReadonly, watchEffect } from 'vue';
import { isDefined, tryOnUnmounted, type MaybeRef } from '@vueuse/shared';
import { Layer, TileLayer, type Map, type TileLayerOptions } from 'leaflet';

export type UseTileLayerOptions = TileLayerOptions;

function useLeafletLayer<T extends Layer>(
  map: MaybeRef<Map | null | undefined>,
  createOrUpdateFn: (instance?: T) => Layer | null | undefined,
  destroyFn?: (instance: T) => void
): Ref<T | null> {
  const instance = ref<T | null>(null);

  watchEffect(() => {});

  function destroy() {
    if (isDefined(instance)) {
      if (typeof destroyFn === 'function') {
        destroyFn(instance.value as T);
      } else {
        instance.value!.off().remove();
      }

      (instance.value as null) = null;
    }
  }

  return instance as Ref<T | null>;
}

export function useLeafletTileLayer(
  map: MaybeRef<Map | null | undefined>,
  url: MaybeRef<string | null | undefined>,
  options: UseTileLayerOptions = {}
): Ref<TileLayer | null> {
  useLeafletLayer(map, instance => {
    const url = unref(url);
    if (isDefined(url)) {
      if (instance) {
        return instance.setUrl(url);
      } else {
        return new TileLayer(url, options);
      }
    }
    instance?.off().remove();
    return null;
  });

  const tileLayer = ref<TileLayer | null>(null) as Ref<TileLayer | null>;

  watch(
    () => unref(url),
    () => {
      if (isDefined(url)) {
        create(unref(url)!);
      } else {
        destroy();
      }
    },
    { immediate: true }
  );

  watch(
    () => unref(map),
    () => {
      if (isDefined(map)) {
        tileLayer.value?.addTo(unref(map)!);
      } else {
        tileLayer.value?.remove();
      }
    },
    {
      immediate: true
    }
  );

  function create(url: string) {}

  function destroy() {
    tileLayer.value?.off().remove();
    tileLayer.value = null;
  }

  tryOnUnmounted(() => {
    destroy();
  });

  return shallowReadonly(tileLayer) as Ref<TileLayer | null>;
}

export type UseLeafletTileLayerReturn = ReturnType<typeof useLeafletTileLayer>;
