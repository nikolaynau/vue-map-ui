import { Evented } from 'leaflet';
import { describe, it, expect, vi } from 'vitest';
import { ref, markRaw, nextTick } from 'vue';
import { useLeafletEvent } from '../useLeafletEvent';

class EventTest extends Evented {}

describe('useLeafletEvent', () => {
  it('target ref is defined', () => {
    const eventSource = new EventTest();
    const target = ref<Evented>(markRaw(eventSource));
    const listener = vi.fn();
    const events = ['event1', 'event2'];
    const data = [{ a: 1, b: 1 }, { c: 3 }];

    useLeafletEvent(target, events, listener);

    eventSource.fire(events[0], data[0]);
    eventSource.fire(events[1], data[1]);

    expect(listener.mock.calls).toHaveLength(2);

    expect(listener.mock.calls[0][0]).contains(data[0]);
    expect(listener.mock.calls[0][0].type).toBe(events[0]);

    expect(listener.mock.calls[1][0]).contains(data[1]);
    expect(listener.mock.calls[1][0].type).toBe(events[1]);
  });

  it('unsubscribe when source set is null', async () => {
    const eventSource = new EventTest();
    const target = ref<Evented | null | undefined>(markRaw(eventSource));
    const listener = vi.fn();
    const events = ['event1'];
    const data = [{ a: 1, b: 1 }];

    useLeafletEvent(target, events, listener);
    target.value = null;

    await nextTick();

    eventSource.fire(events[0], data[0]);

    expect(listener.mock.calls).toHaveLength(0);
  });

  it('stop listening source', () => {
    const eventSource = new EventTest();
    const target = ref<Evented | null | undefined>(markRaw(eventSource));
    const listener = vi.fn();
    const events = ['event1'];
    const data = [{ a: 1, b: 1 }];

    const stop = useLeafletEvent(target, events, listener);
    stop();

    eventSource.fire(events[0], data[0]);

    expect(listener.mock.calls).toHaveLength(0);
  });

  it('resubsribe', async () => {
    const eventSource1 = markRaw(new EventTest());
    const eventSource2 = markRaw(new EventTest());

    const target = ref<Evented | null | undefined>(eventSource1);
    const listener = vi.fn();
    const events = ['es1:event', 'es2:event'];

    useLeafletEvent(target, events, listener);

    eventSource1.fire(events[0]);

    target.value = eventSource2;

    await nextTick();

    eventSource1.fire(events[0]);
    eventSource2.fire(events[1]);

    expect(listener.mock.calls).toHaveLength(2);
    expect(listener.mock.calls[0][0].type).toBe(events[0]);
    expect(listener.mock.calls[1][0].type).toBe(events[1]);
  });
});
