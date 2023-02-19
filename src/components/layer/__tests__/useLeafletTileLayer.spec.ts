import { describe, it, expect } from 'vitest';
import { nextTick, ref } from 'vue';
import { TileLayer } from 'leaflet';
import { useLeafletTileLayer } from '../composables/useLeafletTileLayer';

describe('useLeafletTileLayer', () => {
  const testUrl = 'https://tileserver.com/tiles';

  it('initial url as string', () => {
    const tileLayer = useLeafletTileLayer(null, testUrl);
    expect(tileLayer.value).toBeInstanceOf(TileLayer);
  });

  it('initial url as ref', () => {
    const url = ref(testUrl);
    const tileLayer = useLeafletTileLayer(null, url);
    expect(tileLayer.value).toBeInstanceOf(TileLayer);
  });

  it('initial url is null', () => {
    const tileLayer = useLeafletTileLayer(null, null);
    expect(tileLayer.value).toBeNull();
  });

  it('destroy layer when set null to url', async () => {
    const url = ref<string | null>(testUrl);
    const tileLayer = useLeafletTileLayer(null, url);

    expect(tileLayer.value).toBeInstanceOf(TileLayer);

    url.value = null;
    await nextTick();

    expect(tileLayer.value).toBeNull();
  });

  it('create layer when set url', async () => {
    const url = ref<string | null>(null);
    const tileLayer = useLeafletTileLayer(null, url);

    expect(tileLayer.value).toBeNull();

    url.value = testUrl;
    await nextTick();

    expect(tileLayer.value).toBeInstanceOf(TileLayer);
  });
});
