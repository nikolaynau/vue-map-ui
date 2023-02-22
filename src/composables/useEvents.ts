import { isFunction } from '@vue/shared';
import type { MaybeComputedRef } from '@vueuse/shared';
import type { Evented, LeafletEvent, LeafletEventHandlerFn } from 'leaflet';
import { useLeafletEvent } from 'vue-use-leaflet';

export function useEvents(
  target: MaybeComputedRef<Evented | null | undefined> | undefined,
  listeners: Record<string, LeafletEventHandlerFn>
) {
  return useLeafletEvent(target, Object.keys(listeners), (ev: LeafletEvent) => {
    const fn = listeners[ev.type] as Function;
    if (isFunction(fn)) {
      fn(ev);
    }
  });
}

export type UseEventsReturn = ReturnType<typeof useEvents>;
