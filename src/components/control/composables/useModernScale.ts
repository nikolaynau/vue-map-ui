import { watch } from 'vue';
import { toValue, type MaybeRefOrGetter } from '@vueuse/shared';
import type { Control } from 'leaflet';

export function useModernScale(
  control: MaybeRefOrGetter<Control.Scale | null | undefined>
): () => void {
  const stop = watch(
    () => toValue(control),
    val => {
      if (val) {
        (val as any)._updateScale = (
          scale: HTMLElement,
          text: string,
          ratio: number
        ) => {
          scale.style.width = `${Math.round(val.options.maxWidth! * ratio)}px`;
          const label = `<div class="leaflet-control-scale-line__label">${text}</div>`;
          const line = '<div class="leaflet-control-scale-line__line"></div>';
          const edge = '<div class="leaflet-control-scale-line__edge"></div>';
          scale.innerHTML = `${label}${line}${edge}`;
        };
      }
    },
    { immediate: true, flush: 'sync' }
  );

  return stop;
}
