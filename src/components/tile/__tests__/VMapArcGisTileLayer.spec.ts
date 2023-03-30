import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { TileLayer, type Coords } from 'leaflet';
import VMapArcGisTileLayer from '../VMapArcGisTileLayer.vue';

describe('VMapArcGisTileLayer', () => {
  it('should expose tile layer', () => {
    const wrapper = mount(VMapArcGisTileLayer);
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
  });

  it('should render', () => {
    const wrapper = mount(VMapArcGisTileLayer);
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
    expect(
      wrapper.vm.tileLayer?.getTileUrl({ x: 1, y: 2, z: 3 } as Coords)
    ).toBe(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/NaN/2/1'
    );
  });

  it('should default slot', () => {
    const wrapper = mount(VMapArcGisTileLayer, {
      slots: {
        default: '<div class="child">Text</div>'
      }
    });
    expect(wrapper.find('.child').exists()).toBeTruthy();
    expect(wrapper.find('.child').text()).toBe('Text');
  });
});
