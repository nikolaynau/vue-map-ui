import { computed, markRaw, ref, unref, watch, type Ref } from 'vue';
import { isDef, tryOnBeforeUnmount, type MaybeRef } from '@vueuse/shared';
import {
  latLngBounds,
  latLng,
  Map,
  type LatLngBoundsExpression,
  type LatLngExpression,
  type MapOptions
} from 'leaflet';

export interface UseLeafletMapOptions {
  center?: MaybeRef<LatLngExpression | undefined>;
  zoom?: MaybeRef<number | undefined>;
  bounds?: MaybeRef<LatLngBoundsExpression | undefined>;
  useFly?: MaybeRef<boolean | undefined>;
  leafletOptions?: MapOptions;
}

const DEFAULT_OPTIONS: Readonly<UseLeafletMapOptions> = {
  center: [0, 0],
  zoom: 0,
  leafletOptions: {},
  useFly: false,
  bounds: undefined
};

export function useLeafletMap(
  element: MaybeRef<HTMLElement | null | undefined>,
  options: UseLeafletMapOptions = {}
): Ref<Map | null> {
  const { center, zoom, bounds, useFly, leafletOptions } = {
    ...DEFAULT_OPTIONS,
    ...options
  } as Required<UseLeafletMapOptions>;

  const map = ref<Map | null>(null) as Ref<Map | null>;
  const view = computed(() => ({ center: unref(center), zoom: unref(zoom) }));

  function initializeMap(element: HTMLElement) {
    const needInitView = unref(bounds) || unref(useFly);

    if (needInitView) {
      leafletOptions.center = undefined;
      leafletOptions.zoom = undefined;
    }

    const mapInstance = new Map(element, leafletOptions);

    if (needInitView) {
      setInitialView(mapInstance);
    }

    map.value = markRaw(mapInstance);
  }

  function setInitialView(map: Map) {
    if (unref(bounds)) {
      if (unref(useFly)) {
        map
          .setView(
            DEFAULT_OPTIONS.center as LatLngExpression,
            DEFAULT_OPTIONS.zoom as number
          )
          .flyToBounds(unref(bounds)!);
      } else {
        map.fitBounds(unref(bounds)!);
      }
    } else {
      if (unref(useFly)) {
        map
          .setView(
            DEFAULT_OPTIONS.center as LatLngExpression,
            DEFAULT_OPTIONS.zoom as number
          )
          .flyTo(unref(center)!, unref(zoom));
      }
    }
  }

  function setBounds(bounds: LatLngBoundsExpression) {
    bounds = latLngBounds(bounds as LatLngExpression[]);
    if (!bounds.isValid()) {
      return;
    }

    if (unref(useFly)) {
      map.value?.flyToBounds(bounds);
    } else {
      map.value?.fitBounds(bounds);
    }
  }

  function setView(center: LatLngExpression, zoom?: number) {
    if (unref(useFly)) {
      map.value?.flyTo(center, zoom);
    } else {
      map.value?.setView(center, zoom);
    }
  }

  function setCenter(center: LatLngExpression) {
    if (unref(useFly)) {
      map.value?.flyTo(center);
    } else {
      map.value?.panTo(center);
    }
  }

  function setZoom(zoom: number) {
    if (unref(useFly)) {
      map.value?.flyTo(map.value?.getCenter(), zoom);
    } else {
      map.value?.setZoom(zoom);
    }
  }

  function latLngEquals(
    latLngA: LatLngExpression | null | undefined,
    latLngB: LatLngExpression | null | undefined
  ): boolean {
    if (latLngA === latLngB) {
      return true;
    }
    if (!isDef(latLngA) || !isDef(latLngB)) {
      return false;
    }
    return latLng(latLngA!).equals(latLng(latLngB!));
  }

  function destroyMap() {
    map.value?.off().remove();
  }

  watch(
    () => unref(element),
    value => {
      destroyMap();
      if (value) {
        initializeMap(value);
      }
    },
    {
      immediate: true
    }
  );

  watch(
    () => unref(bounds),
    value => {
      if (value) {
        setBounds(value);
      }
    }
  );

  watch(view, (newValue, oldValue) => {
    if (
      !latLngEquals(newValue.center, oldValue.center) &&
      newValue.zoom !== oldValue.zoom
    ) {
      isDef(newValue.center) && setView(newValue.center, newValue.zoom);
    } else if (!latLngEquals(newValue.center, oldValue.center)) {
      isDef(newValue.center) && setCenter(newValue.center);
    } else if (newValue.zoom !== oldValue.zoom) {
      isDef(newValue.zoom) && setZoom(newValue.zoom);
    }
  });

  tryOnBeforeUnmount(() => {
    destroyMap();
  });

  return map;
}

export type UseLeafletMapReturn = ReturnType<typeof useLeafletMap>;
