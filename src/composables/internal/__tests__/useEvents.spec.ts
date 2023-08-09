import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { ref, markRaw, type Ref } from 'vue';
import { Evented } from 'leaflet';
import { useEvents } from '../useEvents';

describe('useEvents', () => {
  const EventTest = class extends Evented {};
  let eventSource: Evented;
  let target: Ref<Evented>;
  let listeners: Record<string, Mock>;

  beforeEach(() => {
    eventSource = new EventTest();
    target = ref(markRaw(eventSource));
    listeners = { event1: vi.fn(), event2: vi.fn() };
  });

  it('should subscribe events', () => {
    useEvents(target, listeners);

    eventSource.fire('event1');
    eventSource.fire('event2');

    expect(listeners.event1.mock.calls).toHaveLength(1);
    expect(listeners.event2.mock.calls).toHaveLength(1);

    expect(listeners.event1.mock.calls[0][0].type).toBe('event1');
    expect(listeners.event2.mock.calls[0][0].type).toBe('event2');
  });

  it('should unsubscribe events', () => {
    const stop = useEvents(target, listeners);
    stop();

    eventSource.fire('event1');
    eventSource.fire('event2');

    expect(listeners.event1).not.toBeCalled();
    expect(listeners.event2).not.toBeCalled();
  });
});
