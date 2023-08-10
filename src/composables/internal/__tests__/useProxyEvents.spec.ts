import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { ref, markRaw, type Ref } from 'vue';
import { Evented } from 'leaflet';
import { useProxyEvents } from '../useProxyEvents';

describe('useProxyEvents', () => {
  const EventTest = class extends Evented {};
  let eventSource: Evented;
  let target: Ref<Evented>;
  let emit: Mock;

  beforeEach(() => {
    eventSource = new EventTest();
    target = ref(markRaw(eventSource));
    emit = vi.fn();
  });

  it('should be subscribe events', () => {
    const attrs = { onEventB: vi.fn(), onEventD: [vi.fn(), vi.fn()] };
    useProxyEvents(
      target,
      ['eventA', 'eventB', 'eventC', 'eventD'],
      attrs,
      emit
    );

    eventSource.fire('eventA');
    eventSource.fire('eventB');
    eventSource.fire('eventC');
    eventSource.fire('eventD');

    expect(emit.mock.calls).toHaveLength(2);
    expect(attrs.onEventB.mock.calls).toHaveLength(1);
    expect(attrs.onEventD[0].mock.calls).toHaveLength(1);
    expect(attrs.onEventD[1].mock.calls).toHaveLength(1);

    expect(emit.mock.calls[0][0]).toBe('eventA');
    expect(emit.mock.calls[1][0]).toBe('eventC');
    expect(emit.mock.calls[0][1].type).toBe('eventA');
    expect(emit.mock.calls[1][1].type).toBe('eventC');

    expect(attrs.onEventB.mock.calls[0][0].type).toBe('eventB');
    expect(attrs.onEventD[0].mock.calls[0][0].type).toBe('eventD');
    expect(attrs.onEventD[1].mock.calls[0][0].type).toBe('eventD');
  });

  it('should unsubscribe events', () => {
    const stop = useProxyEvents(target, ['eventA', 'eventB'], {}, emit);
    stop();

    eventSource.fire('eventA');
    eventSource.fire('eventB');

    expect(emit).not.toBeCalled();
  });
});
