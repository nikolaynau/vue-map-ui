import type { MaybeComputedRef } from '@vueuse/shared';
import type { Evented, LeafletEvent, LeafletEventHandlerFn } from 'leaflet';
import { useLeafletEvent } from './useLeafletEvent';

export function useEvents(
  target: MaybeComputedRef<Evented | null | undefined> | undefined,
  listeners: Record<string, LeafletEventHandlerFn>
) {
  function handleEvent(ev: LeafletEvent) {
    const fn = listeners[ev.type] as Function;
    if (typeof fn === 'function') {
      fn(ev);
    }
  }

  return useLeafletEvent(target, Object.keys(listeners), handleEvent);
}

export type UseEventsReturn = ReturnType<typeof useEvents>;
