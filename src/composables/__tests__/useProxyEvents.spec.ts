import { Evented } from 'leaflet';
import { describe, it, expect, vi } from 'vitest';
import { ref, markRaw, nextTick } from 'vue';
import { useProxyEvents } from '../useProxyEvents';

class EventTest extends Evented {}

describe('useProxyEvents', () => {
  it('source ref is defined', () => {
    const eventSource = new EventTest();
    const source = ref<Evented>(markRaw(eventSource));
    const target = vi.fn();
    const events = ['event1', 'event2'];
    const data = [{ a: 1, b: 1 }, { c: 3 }];

    useProxyEvents(source, target, events);

    eventSource.fire(events[0], data[0]);
    eventSource.fire(events[1], data[1]);

    expect(target.mock.calls).toHaveLength(2);

    expect(target.mock.calls[0][0]).toBe(events[0]);
    expect(target.mock.calls[0][1]).contains(data[0]);

    expect(target.mock.calls[1][0]).toBe(events[1]);
    expect(target.mock.calls[1][1]).contains(data[1]);
  });

  it('unsubscribe when source set is null', async () => {
    const eventSource = new EventTest();
    const source = ref<Evented | null | undefined>(markRaw(eventSource));
    const target = vi.fn();
    const events = ['event1'];
    const data = [{ a: 1, b: 1 }];

    useProxyEvents(source, target, events);
    source.value = null;

    await nextTick();

    eventSource.fire(events[0], data[0]);

    expect(target.mock.calls).toHaveLength(0);
  });

  it('stop listening source', () => {
    const eventSource = new EventTest();
    const source = ref<Evented | null | undefined>(markRaw(eventSource));
    const target = vi.fn();
    const events = ['event1'];
    const data = [{ a: 1, b: 1 }];

    const { stop } = useProxyEvents(source, target, events);
    stop();

    eventSource.fire(events[0], data[0]);

    expect(target.mock.calls).toHaveLength(0);
  });

  it('resubsribe', async () => {
    const eventSource1 = markRaw(new EventTest());
    const eventSource2 = markRaw(new EventTest());

    const source = ref<Evented | null | undefined>(eventSource1);
    const target = vi.fn();
    const events = ['es1:event', 'es2:event'];

    useProxyEvents(source, target, events);

    eventSource1.fire(events[0]);

    source.value = eventSource2;

    await nextTick();

    eventSource1.fire(events[0]);
    eventSource2.fire(events[1]);

    expect(target.mock.calls).toHaveLength(2);
    expect(target.mock.calls[0][0]).toBe(events[0]);
    expect(target.mock.calls[1][0]).toBe(events[1]);
  });
});
