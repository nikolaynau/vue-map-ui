import {
  computed,
  markRaw,
  ref,
  unref,
  watch,
  shallowReadonly,
  type Ref
} from 'vue';
import { isDefined, tryOnUnmounted, type MaybeRef } from '@vueuse/shared';
import {
  latLngBounds,
  latLng,
  Map,
  type LatLngBoundsExpression,
  type LatLngExpression,
  type MapOptions,
  type LeafletEvent,
  type LatLng,
  type LatLngBounds
} from 'leaflet';
import { useLeafletEvent } from '@/composables/useLeafletEvent';

export interface UseLeafletMapOptions extends UseLeafletMapCallbacks {
  center?: MaybeRef<LatLngExpression | undefined>;
  zoom?: MaybeRef<number | undefined>;
  bounds?: MaybeRef<LatLngBoundsExpression | undefined>;
  useFly?: MaybeRef<boolean | undefined>;
  leafletOptions?: MapOptions;
}

export interface UseLeafletMapCallbacks {
  onViewChanged?: (ev: ViewChangedEvent) => void;
}

export interface ViewChangedEvent extends LeafletEvent {
  center: LatLng;
  zoom: number;
  bounds: LatLngBounds;
}

export type ViewChangedEventHandler = (event: ViewChangedEvent) => void;

const DEFAULT_OPTIONS: Readonly<UseLeafletMapOptions> = {
  center: [0, 0],
  zoom: 0,
  useFly: false
};

export function useLeafletMap(
  element: MaybeRef<HTMLElement | null | undefined>,
  options: UseLeafletMapOptions = {}
): Ref<Map | null> {
  const {
    center = DEFAULT_OPTIONS.center,
    zoom = DEFAULT_OPTIONS.zoom,
    useFly = DEFAULT_OPTIONS.useFly,
    leafletOptions = {},
    bounds,
    onViewChanged
  } = options;

  const map = ref<Map | null>(null) as Ref<Map | null>;
  const view = computed(() => ({ center: unref(center), zoom: unref(zoom) }));

  function initializeMap(element: HTMLElement) {
    const needInitView = unref(bounds) || unref(useFly);

    if (needInitView) {
      leafletOptions.center = undefined;
      leafletOptions.zoom = undefined;
    } else {
      if (!isDefined(leafletOptions.center)) {
        leafletOptions.center = unref(center);
      }
      if (!isDefined(leafletOptions.zoom)) {
        leafletOptions.zoom = unref(zoom);
      }
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
    if (!isDefined(latLngA) || !isDefined(latLngB)) {
      return false;
    }
    return latLng(latLngA!).equals(latLng(latLngB!));
  }

  function destroyMap() {
    map.value?.off().remove();
    map.value = null;
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
      immediate: true,
      flush: 'sync'
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
      isDefined(newValue.center) && setView(newValue.center, newValue.zoom);
    } else if (!latLngEquals(newValue.center, oldValue.center)) {
      isDefined(newValue.center) && setCenter(newValue.center);
    } else if (newValue.zoom !== oldValue.zoom) {
      isDefined(newValue.zoom) && setZoom(newValue.zoom);
    }
  });

  if (onViewChanged) {
    useLeafletEvent(map, 'moveend', (ev: LeafletEvent) => {
      const map = ev.sourceTarget as Map;
      onViewChanged({
        center: map.getCenter(),
        zoom: map.getZoom(),
        bounds: map.getBounds(),
        ...ev
      });
    });
  }

  tryOnUnmounted(() => {
    destroyMap();
  });

  return shallowReadonly(map) as Ref<Map | null>;
}

export type UseLeafletMapReturn = ReturnType<typeof useLeafletMap>;
