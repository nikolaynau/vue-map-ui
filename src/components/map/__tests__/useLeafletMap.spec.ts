import {
  latLng,
  latLngBounds,
  type LatLngBoundsLiteral,
  type LatLngExpression
} from 'leaflet';
import { describe, it, expect, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useLeafletMap } from '../composables/useLeafletMap';

describe('useLeafletMap', () => {
  it('defualt options', () => {
    const div = document.createElement('div');
    const element = ref(div);
    const map = useLeafletMap(element);

    expect(map.value).toBeDefined();
    expect(map.value?.getCenter()).toEqual({ lat: 0, lng: 0 });
    expect(map.value?.getZoom()).toBe(0);
  });

  it('init map with center and zoom', () => {
    const div = document.createElement('div');
    const element = ref(div);
    const map = useLeafletMap(element, {
      center: [1, 2],
      zoom: 12
    });

    expect(map.value).toBeDefined();
    expect(map.value?.options.center).toBeDefined();
    expect(map.value?.options.zoom).toBeDefined();
    expect(map.value?.getCenter()).toEqual({ lat: 1, lng: 2 });
    expect(map.value?.getZoom()).toBe(12);
  });

  it('init map with bounds', () => {
    const div = document.createElement('div');
    const element = ref(div);
    const map = useLeafletMap(element, {
      bounds: [
        [1, 2],
        [3, 4]
      ]
    });

    expect(map.value).toBeDefined();
    expect(map.value?.options.center).toBeUndefined();
    expect(map.value?.options.zoom).toBeUndefined();

    const resultBounds = map.value?.getBounds();
    expect(resultBounds?.getEast()).toBeCloseTo(2.8, 1);
    expect(resultBounds?.getNorth()).toBeCloseTo(1.4, 1);
    expect(resultBounds?.getSouth()).toBeCloseTo(1.4, 1);
    expect(resultBounds?.getWest()).toBeCloseTo(2.8, 1);
  });

  it('lazy element assignment', async () => {
    const div = document.createElement('div');
    const element = ref<HTMLElement | null>(null);
    const map = useLeafletMap(element);

    expect(map.value).toBeNull();

    element.value = div;

    await nextTick();

    expect(map.value).toBeDefined();
  });

  it('destroy previous map when element changes', async () => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');

    const element = ref<HTMLElement | null>(null);
    const map = useLeafletMap(element);

    element.value = div1;
    await nextTick();

    expect(map.value).toBeDefined();

    const map1 = map.value;
    const removeSpy = vi.spyOn(map1!, 'remove');

    element.value = div2;
    await nextTick();

    expect(map.value).toBeDefined();

    const map2 = map.value;

    expect(map1).not.toBe(map2);

    expect(removeSpy).toBeCalled();
  });

  it('destroy map when element changed to null', async () => {
    const div = document.createElement('div');
    const element = ref<HTMLElement | null>(div);
    const map = useLeafletMap(element);

    expect(map.value).toBeDefined();
    const removeSpy = vi.spyOn(map.value!, 'remove');

    element.value = null;
    await nextTick();

    expect(map.value).toBeNull();
    expect(removeSpy).toBeCalled();
  });

  it('leaflet events', () => {
    const div = document.createElement('div');
    const element = ref<HTMLElement | null>(div);
    const listener = vi.fn();
    const map = useLeafletMap(element, {
      events: ['moveend', 'zoomend', 'event1'],
      onEvent: listener
    });

    map.value?.setView([1, 2], 4, { animate: false });
    map.value?.fire('event1');

    expect(listener).toBeCalledTimes(3);
    expect(listener.mock.calls[0][0].type).toBe('zoomend');
    expect(listener.mock.calls[1][0].type).toBe('moveend');
    expect(listener.mock.calls[2][0].type).toBe('event1');
  });

  it('call onViewChanged when map view changed', () => {
    const div = document.createElement('div');
    const element = ref<HTMLElement | null>(div);
    const listener = vi.fn();
    const map = useLeafletMap(element, {
      onViewChanged: listener
    });

    map.value?.setView([1, 2], 4, { animate: false });

    expect(listener).toBeCalledTimes(1);
    expect(listener.mock.calls[0][0].center).toEqual({ lat: 1, lng: 2 });
    expect(listener.mock.calls[0][0].zoom).toBe(4);
    expect(listener.mock.calls[0][0].bounds).toBeDefined();
  });

  it.each([
    [false, 'fitBounds'],
    [true, 'flyToBounds']
  ])('change bounds (useFly: %s, method: %s)', async (useFly, methodName) => {
    const div = document.createElement('div');
    const element = ref<HTMLElement | null>(div);
    const bounds = ref<LatLngBoundsLiteral>([
      [1, 2],
      [3, 4]
    ]);
    const map = useLeafletMap(element, {
      bounds,
      useFly
    });

    expect(map.value).toBeDefined();
    const spy = vi.spyOn(map.value!, methodName as any);

    bounds.value = [
      [5, 6],
      [7, 8]
    ];

    await nextTick();

    expect(spy).toBeCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual(
      latLngBounds([
        [5, 6],
        [7, 8]
      ])
    );
  });

  it.each([
    [false, 'setView'],
    [true, 'flyTo']
  ])(
    'change center and zoom (useFly: %s, method: %s)',
    async (useFly, methodName) => {
      const div = document.createElement('div');
      const element = ref<HTMLElement | null>(div);
      const center = ref<LatLngExpression>([1, 2]);
      const zoom = ref(1);

      const map = useLeafletMap(element, {
        center,
        zoom,
        useFly
      });

      expect(map.value).toBeDefined();
      const spy = vi.spyOn(map.value!, methodName as any);

      center.value = [3, 4];
      zoom.value = 2;

      await nextTick();

      expect(spy).toBeCalledTimes(1);
      expect(spy.mock.calls[0][0]).toEqual([3, 4]);
      expect(spy.mock.calls[0][1]).toBe(2);
    }
  );

  it.each([
    [false, 'panTo'],
    [true, 'flyTo']
  ])('change center (useFly: %s, method: %s)', async (useFly, methodName) => {
    const div = document.createElement('div');
    const element = ref<HTMLElement | null>(div);
    const center = ref<LatLngExpression>([1, 2]);

    const map = useLeafletMap(element, {
      center,
      useFly
    });

    expect(map.value).toBeDefined();
    const spy = vi.spyOn(map.value!, methodName as any);

    center.value = [3, 4];

    await nextTick();

    expect(spy).toBeCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual([3, 4]);
  });

  it.each([
    [false, 'setZoom'],
    [true, 'flyTo']
  ])('change zoom (useFly: %s, method: %s)', async (useFly, methodName) => {
    const div = document.createElement('div');
    const element = ref<HTMLElement | null>(div);
    const center = ref<LatLngExpression>([1, 2]);
    const zoom = ref(1);

    const map = useLeafletMap(element, {
      center,
      zoom,
      useFly
    });

    expect(map.value).toBeDefined();
    const spy = vi.spyOn(map.value!, methodName as any);

    zoom.value = 2;

    await nextTick();

    expect(spy).toBeCalledTimes(1);
    if (useFly) {
      expect(spy.mock.calls[0][0]).toEqual(latLng([1, 2]));
      expect(spy.mock.calls[0][1]).toBe(2);
    } else {
      expect(spy.mock.calls[0][0]).toBe(2);
    }
  });
});
