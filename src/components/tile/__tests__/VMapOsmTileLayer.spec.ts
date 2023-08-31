import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { TileLayer, type Coords } from 'leaflet';
import VMapOsmTileLayer from '../VMapOsmTileLayer.vue';

describe('VMapOsmTileLayer', () => {
  it('should expose tile layer', () => {
    const wrapper = mount(VMapOsmTileLayer);
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
  });

  it('should render', () => {
    const wrapper = mount(VMapOsmTileLayer);
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
    expect(
      wrapper.vm.tileLayer?.getTileUrl({ x: 1, y: 2, z: 3 } as Coords)
    ).toBe('https://a.tile.openstreetmap.org/NaN/1/2.png');
  });

  it('should default slot', () => {
    const wrapper = mount(VMapOsmTileLayer, {
      slots: {
        default: '<div class="child">Text</div>'
      }
    });
    expect(wrapper.find('.child').exists()).toBeTruthy();
    expect(wrapper.find('.child').text()).toBe('Text');
  });

  it('should be passed custom attrs', () => {
    const listener = vi.fn();
    const wrapper = mount(VMapOsmTileLayer, {
      attrs: {
        'foo-bar': 1,
        barFoo: 2,
        foo: 3,
        onLoad: listener,
        onTileload: listener,
        onCustomEvent: listener
      }
    });
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
    const options = wrapper.vm.tileLayer?.options;
    expect((options as any).fooBar).toBe(1);
    expect((options as any).barFoo).toBe(2);
    expect((options as any).foo).toBe(3);

    wrapper.vm.tileLayer?.fire('load');
    wrapper.vm.tileLayer?.fire('tileload');
    wrapper.vm.tileLayer?.fire('customEvent');

    expect(listener).toBeCalledTimes(3);
  });
});
