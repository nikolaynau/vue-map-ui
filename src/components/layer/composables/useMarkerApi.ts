import { type Ref } from 'vue';
import type { DivIcon, Icon } from 'leaflet';

export interface UseMarkerApiOptions {
  icon: Ref<Icon | DivIcon | null | undefined>;
}

export function useMarkerApi(options: UseMarkerApiOptions) {
  function setIcon(icon: Icon | DivIcon | null | undefined) {
    options.icon.value = icon;
  }

  return {
    setIcon
  };
}

export type UseMarkerApiReturn = ReturnType<typeof useMarkerApi>;
