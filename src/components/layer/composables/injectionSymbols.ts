import type { InjectionKey, Ref } from 'vue';
import type { Marker, TileLayer } from 'leaflet';

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
