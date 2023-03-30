import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { TileLayer, type Coords } from 'leaflet';
import VMapMapboxTileLayer from '../VMapMapboxTileLayer.vue';

describe('VMapMapboxTileLayer', () => {
  it('should expose tile layer', () => {
    const wrapper = mount(VMapMapboxTileLayer, {
      props: { accessToken: 'abc', id: 'd' }
    });
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
  });

  it('should render', () => {
    const wrapper = mount(VMapMapboxTileLayer, {
      props: { accessToken: 'abc', id: 'd' }
    });
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
    expect(
      wrapper.vm.tileLayer?.getTileUrl({ x: 1, y: 2, z: 3 } as Coords)
    ).toBe(
      'https://api.mapbox.com/styles/v1/mapbox/d/tiles/NaN/1/2?access_token=abc'
    );
  });

  it('should default slot', () => {
    const wrapper = mount(VMapMapboxTileLayer, {
      props: { accessToken: 'abc', id: 'd' },
      slots: {
        default: '<div class="child">Text</div>'
      }
    });
    expect(wrapper.find('.child').exists()).toBeTruthy();
    expect(wrapper.find('.child').text()).toBe('Text');
  });
});
