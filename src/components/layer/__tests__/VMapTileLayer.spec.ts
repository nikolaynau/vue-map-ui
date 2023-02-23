import { describe, it, expect, vi } from 'vitest';
import { ref, unref, h, nextTick, defineComponent, type Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { TileLayer, type Coords } from 'leaflet';
import { VMap } from '@/components/map';
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

  function wrapComponent(defaultSlotFn: () => any) {
    return defineComponent({
      setup() {
        return () => h(VMap, null, { default: defaultSlotFn });
      }
    });
  }

  it('should render with default props', () => {
    const wrapper = mount(VMapTileLayer);
    expect(wrapper.html()).toBe('<!--v-if-->');
  });

  it('should be expose instance', () => {
    const wrapper = mount(VMapTileLayer, { props: { url: testUrl } });
    expectTileLayer(wrapper.vm.tileLayer);
  });

  it('should work', async () => {
    const wrapper = mount(VMap, {
      slots: { default: () => h(VMapTileLayer, { url: testUrl }) }
    });

    await nextTick();

    const mapComponent = wrapper.findComponent(VMap);
    const tileLayerComponent = wrapper.findComponent(VMapTileLayer);

    expect(mapComponent.exists()).toBeTruthy();
    expect(tileLayerComponent.exists()).toBeTruthy();

    expectTileLayer(tileLayerComponent.vm.tileLayer);
    expect(
      mapComponent.vm.map!.hasLayer(tileLayerComponent.vm.tileLayer!)
    ).toBeTruthy();
  });

  /*it('should remove from map when component is unmounted', async () => {
    const wrapper = mount(VMap, {
      slots: { default: () => h(VMapTileLayer, { url: testUrl }) }
    });

    await nextTick();

    const mapComponent = wrapper.findComponent(VMap);
    const tileLayerComponent = wrapper.findComponent(VMapTileLayer);

    expect(mapComponent.exists()).toBeTruthy();
    expect(tileLayerComponent.exists()).toBeTruthy();

    const { tileLayer } = tileLayerComponent.vm;
    const { map } = mapComponent.vm;

    expectTileLayer(tileLayer);
    expect(map!.hasLayer(tileLayer!)).toBeTruthy();

    wrapper.unmount();

    expect(map!.hasLayer(tileLayer!)).toBe(false);
  });*/
});
