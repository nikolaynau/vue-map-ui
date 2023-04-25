import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { TileLayer, type Coords } from 'leaflet';
import VMapOpenTransportTileLayer from '../VMapOpenTransportTileLayer.vue';

describe('VMapOpenTransportTileLayer', () => {
  it('should expose tile layer', () => {
    const apiKey = 'abc';
    const wrapper = mount(VMapOpenTransportTileLayer, { props: { apiKey } });
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
  });

  it('should render', () => {
    const apiKey = 'abc';
    const wrapper = mount(VMapOpenTransportTileLayer, { props: { apiKey } });
    expect(
      wrapper.vm.tileLayer?.getTileUrl({ x: 1, y: 2, z: 3 } as Coords)
    ).toBe('https://a.tile.thunderforest.com/transport/NaN/1/2.png?apikey=abc');
  });

  it('should default slot', () => {
    const wrapper = mount(VMapOpenTransportTileLayer, {
      props: { apiKey: 'abc' },
      slots: {
        default: '<div class="child">Text</div>'
      }
    });
    expect(wrapper.find('.child').exists()).toBeTruthy();
    expect(wrapper.find('.child').text()).toBe('Text');
  });
});
