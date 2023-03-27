import type { InjectionKey } from 'vue';
import type { UseLayersControlApiReturn } from '../composables/internal/useLayersControlApi';

export const layersControlApiKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'LayersControlApi'
    : ''
) as InjectionKey<UseLayersControlApiReturn>;
