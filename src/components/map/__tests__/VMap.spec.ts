import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VMap from '../VMap.vue';

describe('VMap', () => {
  it('render default props', () => {
    const wrapper = mount(VMap);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('map and container exist after component is mounted', () => {
    const wrapper = mount(VMap);
    expect(wrapper.vm.container).toBeDefined();
    expect(wrapper.vm.map).toBeDefined();
  });

  it('center and zoom props', () => {
    const wrapper = mount(VMap, { props: { center: [1, 2], zoom: 3 } });
    expect(wrapper.vm.map?.getZoom()).toBe(3);
    expect(wrapper.vm.map?.getCenter()).toEqual({ lat: 1, lng: 2 });
  });

  it('inherit css class', () => {
    const wrapper = mount(VMap, { attrs: { class: 'some-class' } });
    expect(wrapper.find('.v-map').classes('some-class')).toBe(true);
  });

  it('inherit css style', () => {
    const expected = 'height: 100px';
    const wrapper = mount(VMap, { attrs: { style: expected } });
    expect(wrapper.find('.v-map').attributes('style')).contains(expected);
  });

  it('inherit id attrs', () => {
    const expected = 'map-1';
    const wrapper = mount(VMap, { attrs: { id: expected } });
    expect(wrapper.find('.v-map').attributes('id')).contains(expected);
  });

  it('inherit any attrs', () => {
    const expected = 'map-1';
    const wrapper = mount(VMap, {
      props: { excludeAttrs: ['data-id'] },
      attrs: { 'data-id': expected }
    });
    expect(wrapper.find('.v-map').attributes('data-id')).contains(expected);
  });

  it('set leaflet property', () => {
    const wrapper = mount(VMap, {
      attrs: { maxZoom: 5 }
    });
    expect(wrapper.vm.map?.getMaxZoom()).toBe(5);
  });
});
