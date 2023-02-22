import type { Map } from 'leaflet';
import type { InjectionKey, Ref } from 'vue';

export const mapKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'Map'
    : ''
) as InjectionKey<Ref<Map | null>>;
