import type { InjectionKey, Ref } from 'vue';
import type { Control } from 'leaflet';
import type { UseLayersControlApiReturn } from './useLayersControlApi';

export const layersControlKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'LayersControl'
    : ''
) as InjectionKey<Ref<Control.Layers | null>>;

export const zoomControlKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'ZoomControl'
    : ''
) as InjectionKey<Ref<Control.Zoom | null>>;

export const scaleControlKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'ScaleControl'
    : ''
) as InjectionKey<Ref<Control.Scale | null>>;

export const attributionControlKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'AttributionControl'
    : ''
) as InjectionKey<Ref<Control.Attribution | null>>;

export const layersControlApiKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'LayersControlApi'
    : ''
) as InjectionKey<UseLayersControlApiReturn>;
