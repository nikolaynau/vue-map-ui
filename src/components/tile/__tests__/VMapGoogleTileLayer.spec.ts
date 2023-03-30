import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { TileLayer, type Coords } from 'leaflet';
import VMapGoogleTileLayer from '../VMapGoogleTileLayer.vue';

describe('VMapGoogleTileLayer', () => {
  it('should expose tile layer', () => {
    const wrapper = mount(VMapGoogleTileLayer);
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
  });

  it('should render', () => {
    const wrapper = mount(VMapGoogleTileLayer);
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
    expect(
      wrapper.vm.tileLayer?.getTileUrl({ x: 1, y: 2, z: 3 } as Coords)
    ).toBe('https://mt3.google.com/vt/lyrs=m&x=1&y=2&z=NaN');
  });

  it('should default slot', () => {
    const wrapper = mount(VMapGoogleTileLayer, {
      slots: {
        default: '<div class="child">Text</div>'
      }
    });
    expect(wrapper.find('.child').exists()).toBeTruthy();
    expect(wrapper.find('.child').text()).toBe('Text');
  });

  it.each([
    ['hybrid', 'https://mt3.google.com/vt/lyrs=s,h&x=1&y=2&z=NaN'],
    ['satellite', 'https://mt3.google.com/vt/lyrs=s&x=1&y=2&z=NaN'],
    ['streets', 'https://mt3.google.com/vt/lyrs=m&x=1&y=2&z=NaN'],
    ['terrain', 'https://mt3.google.com/vt/lyrs=p&x=1&y=2&z=NaN']
  ])('should work with type %o', (type, expectedUrl) => {
    const wrapper = mount(VMapGoogleTileLayer as any, { props: { type } });
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
    expect(
      wrapper.vm.tileLayer?.getTileUrl({ x: 1, y: 2, z: 3 } as Coords)
    ).toBe(expectedUrl);
  });

  it('should ignore type when set layers prop', () => {
    const wrapper = mount(VMapGoogleTileLayer, {
      props: {
        type: 'terrain',
        layers: 'abc'
      }
    });
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
    expect(
      wrapper.vm.tileLayer?.getTileUrl({ x: 1, y: 2, z: 3 } as Coords)
    ).toBe('https://mt3.google.com/vt/lyrs=abc&x=1&y=2&z=NaN');
  });

  it('should work with subdomains', () => {
    const wrapper = mount(VMapGoogleTileLayer, {
      props: {
        subdomains: ['a1']
      }
    });
    expect(wrapper.vm.tileLayer).toBeInstanceOf(TileLayer);
    expect(
      wrapper.vm.tileLayer?.getTileUrl({ x: 1, y: 2, z: 3 } as Coords)
    ).toBe('https://a1.google.com/vt/lyrs=m&x=1&y=2&z=NaN');
  });
});
