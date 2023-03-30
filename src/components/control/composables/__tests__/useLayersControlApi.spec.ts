import { Layer } from 'leaflet';
import { describe, it, expect } from 'vitest';
import { markRaw, reactive, ref } from 'vue';
import {
  useLayersControlApi,
  type LayersItemIdConfig
} from '../useLayersControlApi';

describe('useLayersControlApi', () => {
  it('should work add', () => {
    const layers: LayersItemIdConfig[] = reactive([]);
    const layer = ref(markRaw(new Layer()));
    const { add } = useLayersControlApi(layers);

    add(1, 'foo', layer, false);
    add(2, 'bar', layer, true);

    expect(layers).toHaveLength(2);
    expect(layers[0]).toEqual({
      id: 1,
      name: 'foo',
      layer: layer.value,
      overlay: false
    });
    expect(layers[1]).toEqual({
      id: 2,
      name: 'bar',
      layer: layer.value,
      overlay: true
    });
  });

  it('should work remove', () => {
    const layers: LayersItemIdConfig[] = reactive([]);
    const layer = ref(markRaw(new Layer()));
    const { add, remove } = useLayersControlApi(layers);

    add(1, 'foo', layer, false);
    add(2, 'bar', layer, true);

    expect(layers).toHaveLength(2);

    remove(2);
    expect(layers).toHaveLength(1);
    expect(layers[0]).toEqual({
      id: 1,
      name: 'foo',
      layer: layer.value,
      overlay: false
    });
  });

  it('should work getOne', () => {
    const layers: LayersItemIdConfig[] = reactive([]);
    const layer = ref(markRaw(new Layer()));
    const { add, getOne } = useLayersControlApi(layers);

    add(1, 'foo', layer, false);
    add(2, 'bar', layer, true);

    expect(layers).toHaveLength(2);
    expect(getOne(1)).toEqual({
      id: 1,
      name: 'foo',
      layer: layer.value,
      overlay: false
    });
    expect(getOne(2)).toEqual({
      id: 2,
      name: 'bar',
      layer: layer.value,
      overlay: true
    });
  });

  it('should work getAll', () => {
    const layers: LayersItemIdConfig[] = reactive([]);
    const layer = ref(markRaw(new Layer()));
    const { add, getAll } = useLayersControlApi(layers);

    add(1, 'foo', layer, false);
    add(2, 'bar', layer, true);

    expect(layers).toHaveLength(2);
    expect(getAll()).toEqual([
      {
        id: 1,
        name: 'foo',
        layer: layer.value,
        overlay: false
      },
      {
        id: 2,
        name: 'bar',
        layer: layer.value,
        overlay: true
      }
    ]);
  });

  it('should work updateName', () => {
    const layers: LayersItemIdConfig[] = reactive([]);
    const layer = ref(markRaw(new Layer()));
    const { add, updateName } = useLayersControlApi(layers);

    add(1, 'foo', layer, false);
    add(2, 'bar', layer, true);

    expect(layers).toHaveLength(2);
    updateName(2, 'baz');

    expect(layers).toHaveLength(2);
    expect(layers[1]).toEqual({
      id: 2,
      name: 'baz',
      layer: layer.value,
      overlay: true
    });
  });

  it('should work updateOverlay', () => {
    const layers: LayersItemIdConfig[] = reactive([]);
    const layer = ref(markRaw(new Layer()));
    const { add, updateOverlay } = useLayersControlApi(layers);

    add(1, 'foo', layer, false);
    add(2, 'bar', layer, true);

    expect(layers).toHaveLength(2);
    updateOverlay(2, false);

    expect(layers).toHaveLength(2);
    expect(layers[1]).toEqual({
      id: 2,
      name: 'bar',
      layer: layer.value,
      overlay: false
    });
  });
});
