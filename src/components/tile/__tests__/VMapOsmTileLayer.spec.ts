import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { TileLayer, type Coords } from 'leaflet';
import VMapOsmTileLayer from '../VMapOsmTileLayer.vue';

describe('VMapTileLayer', () => {
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
});
