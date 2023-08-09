import type { MaybeRefOrGetter } from '@vueuse/shared';
import type { Evented, LeafletEvent, LeafletEventHandlerFn } from 'leaflet';
import { ucFirst } from '../../utils/strings';
import { useLeafletEvent } from 'vue-use-leaflet';

export function useProxyEvents<Name extends string>(
  target: MaybeRefOrGetter<Evented | null | undefined> | undefined,
  events: string[],
  attrs: Record<string, unknown>,
  emit: (name: Name, ...args: any[]) => void
) {
  return useLeafletEvent(target, events, (ev: LeafletEvent) => {
    const attrKey = `on${ucFirst(ev.type)}`;
    if (attrs[attrKey]) {
      if (typeof attrs[attrKey] === 'function') {
        (attrs[attrKey] as LeafletEventHandlerFn)(ev);
      } else if (Array.isArray(attrs[attrKey])) {
        (attrs[attrKey] as Function[]).forEach(fn => {
          if (typeof fn === 'function') {
            (fn as LeafletEventHandlerFn)(ev);
          }
        });
      }
    } else {
      emit(ev.type as Name, ev);
    }
  });
}

export type UseProxyEventsReturn = ReturnType<typeof useProxyEvents>;
