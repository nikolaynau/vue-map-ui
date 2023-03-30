import type { InjectionKey, Ref } from 'vue';
import type { TileLayer } from 'leaflet';

export const tileLayerKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'TileLayer'
    : ''
) as InjectionKey<Ref<TileLayer | null>>;
