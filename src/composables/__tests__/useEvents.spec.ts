import { Evented } from 'leaflet';
import { describe, it, expect, vi } from 'vitest';
import { ref, markRaw } from 'vue';
import { useEvents } from '../useEvents';

class EventTest extends Evented {}

describe('useEvents', () => {
  it('subscribe', () => {
    const eventSource = new EventTest();
    const target = ref<Evented>(markRaw(eventSource));
    const listeners = { event1: vi.fn(), event2: vi.fn() };

    useEvents(target, listeners);

    eventSource.fire('event1');
    eventSource.fire('event2');

    expect(listeners.event1.mock.calls).toHaveLength(1);
    expect(listeners.event2.mock.calls).toHaveLength(1);

    expect(listeners.event1.mock.calls[0][0].type).toBe('event1');
    expect(listeners.event2.mock.calls[0][0].type).toBe('event2');
  });

  it('unsubscribe', () => {
    const eventSource = new EventTest();
    const target = ref<Evented>(markRaw(eventSource));
    const listeners = { event1: vi.fn(), event2: vi.fn() };

    const stop = useEvents(target, listeners);
    stop();

    eventSource.fire('event1');
    eventSource.fire('event2');

    expect(listeners.event1).not.toBeCalled();
    expect(listeners.event2).not.toBeCalled();
  });
});
