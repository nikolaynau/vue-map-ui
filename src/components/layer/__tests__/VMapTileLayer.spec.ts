import { describe, it, expect } from 'vitest';
import { ref, unref, h, nextTick, defineComponent, type Ref } from 'vue';
import { TileLayer, type Coords } from 'leaflet';
import { mount } from '../../../../.test';
import { VMap } from '../../../components/map';
import VMapTileLayer from '../VMapTileLayer.vue';

describe('VMapTileLayer', () => {
  const testUrl = 'https://a/b/c';

  function expectTileLayer(layer: any, expectedUrl: string = testUrl) {
    layer = unref(layer);
    expect(layer).toBeDefined();
    expect(layer).not.toBeNull();
    expect(layer).toBeInstanceOf(TileLayer);
    expect(layer.getTileUrl({ z: 1 } as Coords)).toBe(expectedUrl);
  }

  function wrapComponent(
    defaultSlotFn: () => any,
    refs?: Record<string, unknown>,
    isRender: Ref<boolean> | boolean = true
  ) {
    return defineComponent({
      setup() {
        return { ...refs };
      },
      render() {
        return h(
          VMap,
          { ref: 'mapRef' },
          unref(isRender) ? { default: defaultSlotFn } : undefined
        );
      }
    });
  }

  it('should render with default props', () => {
    const vm = mount(VMapTileLayer);
    expect(vm.$el.nodeType).toBe(Node.COMMENT_NODE);
  });

  it('should be expose instance', () => {
    const vm = mount(
      defineComponent({
        setup() {
          const componentRef = ref<InstanceType<typeof VMapTileLayer> | null>(
            null
          );

          return { componentRef };
        },
        render() {
          return h(VMapTileLayer, { url: testUrl, ref: 'componentRef' });
        }
      })
    );

    expect(unref(vm.componentRef)).not.toBeNull();
    expectTileLayer(vm.componentRef!.tileLayer);
  });

  it('should work', async () => {
    const mapRef = ref<InstanceType<typeof VMap> | null>(null);
    const tileLayerRef = ref<InstanceType<typeof VMapTileLayer> | null>(null);
    mount(
      wrapComponent(
        () => h(VMapTileLayer, { url: testUrl, ref: 'tileLayerRef' }),
        {
          mapRef,
          tileLayerRef
        }
      )
    );

    await nextTick();

    expect(unref(mapRef)).toBeTruthy();
    expect(unref(tileLayerRef)).toBeTruthy();

    expectTileLayer(unref(tileLayerRef)?.tileLayer);
    expect(
      unref(mapRef)?.map!.hasLayer(unref(tileLayerRef)?.tileLayer!)
    ).toBeTruthy();
  });

  it('should remove from map when component is unmounted', async () => {
    const mapRef = ref<InstanceType<typeof VMap> | null>(null);
    const tileLayerRef = ref<InstanceType<typeof VMapTileLayer> | null>(null);
    const isRender = ref(true);
    mount(
      wrapComponent(
        () => h(VMapTileLayer, { url: testUrl, ref: 'tileLayerRef' }),
        {
          mapRef,
          tileLayerRef
        },
        isRender
      )
    );

    await nextTick();

    expect(unref(mapRef)).toBeTruthy();
    expect(unref(tileLayerRef)).toBeTruthy();
    const { tileLayer } = unref(tileLayerRef)!;
    expectTileLayer(tileLayer);

    isRender.value = false;

    await nextTick();

    expect(unref(tileLayerRef)).toBeNull();
    expectTileLayer(tileLayer);
    expect(unref(mapRef)?.map!.hasLayer(tileLayer!)).toBeFalsy();
  });
});
