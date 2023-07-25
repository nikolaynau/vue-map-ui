import type { InjectionKey, Ref } from 'vue';
import type { DivIcon, Icon, Marker, TileLayer } from 'leaflet';
import type { UseMarkerApiReturn } from './useMarkerApi';

export const tileLayerKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'TileLayer'
    : ''
) as InjectionKey<Ref<TileLayer | null>>;

export const markerKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'Marker'
    : ''
) as InjectionKey<Ref<Marker | null>>;

export const iconKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'Icon'
    : ''
) as InjectionKey<Ref<Icon | null>>;

export const divIconKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'DivIcon'
    : ''
) as InjectionKey<Ref<DivIcon | null>>;

export const markerApiKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'MarkerApi'
    : ''
) as InjectionKey<UseMarkerApiReturn>;
