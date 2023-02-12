import { unref, watch } from 'vue';
import { tryOnUnmounted, type MaybeRef } from '@vueuse/shared';
import type { Evented, LeafletEvent } from 'leaflet';

export function useProxyEvents(
  source: MaybeRef<Evented | null | undefined>,
  target: (e: string, data: LeafletEvent) => void,
  events: string[]
) {
  function subscribe(source: Evented) {
    for (const event of events) {
      source.on(event, handleEvent);
    }
  }

  function unsubscribe(source: Evented) {
    for (const event of events) {
      source.off(event, handleEvent);
    }
  }

  function handleEvent(event: LeafletEvent) {
    target(event.type, event);
  }

  function stop() {
    if (unref(source)) {
      unsubscribe(unref(source)!);
    }
  }

  if (unref(source)) {
    subscribe(unref(source)!);
  }

  watch(
    () => unref(source),
    (newValue, oldValue) => {
      if (oldValue) {
        unsubscribe(oldValue);
      }
      if (newValue) {
        subscribe(newValue);
      }
    }
  );

  tryOnUnmounted(() => {
    stop();
  });

  return {
    stop
  };
}

export type UseProxyEventsReturn = ReturnType<typeof useProxyEvents>;
