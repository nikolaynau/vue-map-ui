import { describe, it, expect } from 'vitest';
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

    element.value = div2;

    await nextTick();

    expect(map.value).toBeDefined();

    const map2 = map.value;

    expect(map1).not.toBe(map2);
    // check destroy
  });
});
