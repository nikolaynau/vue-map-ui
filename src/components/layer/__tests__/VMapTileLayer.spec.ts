import { describe, it, expect, vi } from 'vitest';
import {
  ref,
  unref,
  h,
  nextTick,
  defineComponent,
  onMounted,
  type Ref
} from 'vue';
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

  it('should not render when url is null', () => {
    const vm = mount(
      defineComponent({
        setup() {
          return () => h(VMapTileLayer, { url: null });
        }
      })
    );
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

  it('should be passed custom attrs', () => {
    expect.assertions(2);

    const Component = defineComponent({
      setup() {
        const tileLayer = ref<InstanceType<typeof VMapTileLayer> | null>(null);

        onMounted(() => {
          const options = tileLayer.value?.tileLayer?.options;
          expect((options as any).fooBar).toBe('fooBar');
          expect((options as any).bar).toBe('bar');
        });

        return () =>
          h(VMapTileLayer, {
            url: testUrl,
            ref: tileLayer,
            fooBar: 'fooBar',
            bar: 'bar'
          });
      }
    });

    mount(Component);
  });

  it('should be passed custom events', () => {
    expect.assertions(1);

    const listener = vi.fn();

    const Component = defineComponent({
      setup() {
        const tileLayer = ref<InstanceType<typeof VMapTileLayer> | null>(null);

        onMounted(() => {
          tileLayer.value?.tileLayer?.fire('load');
          tileLayer.value?.tileLayer?.fire('tileload');
          tileLayer.value?.tileLayer?.fire('customEvent');

          expect(listener).toBeCalledTimes(3);
        });

        return () =>
          h(VMapTileLayer, {
            url: testUrl,
            ref: tileLayer,
            onLoad: listener,
            onTileload: listener,
            onCustomEvent: listener
          });
      }
    });

    mount(Component);
  });
});
