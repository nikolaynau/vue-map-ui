import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useLeafletMap } from '../composables/useLeafletMap';

describe('useLeafletMap', () => {
  it('create map with empty options', () => {
    const div = document.createElement('div');
    const element = ref(div);
    const map = useLeafletMap(element);

    expect(map.value).toBeDefined();
    expect(map.value?.getCenter()).toEqual({});
    expect(map.value?.getZoom()).toBe(0);
  });
});
