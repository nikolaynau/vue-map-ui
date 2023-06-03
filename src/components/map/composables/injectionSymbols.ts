import type { InjectionKey, Ref } from 'vue';
import type { Map } from 'leaflet';

export const mapKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'Map'
    : ''
) as InjectionKey<Ref<Map | null>>;

export const paneKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'Pane'
    : ''
) as InjectionKey<Ref<HTMLElement | null>>;
