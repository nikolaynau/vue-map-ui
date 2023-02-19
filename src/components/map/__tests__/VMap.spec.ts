import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VMap from '../VMap.vue';
import { h, type Ref, nextTick } from 'vue';
import { useMap } from '../composables/useMap';
import { LatLngBounds, type Map, type LatLngBoundsExpression } from 'leaflet';
import type { ViewChangedEvent } from '../composables/useLeafletMap';

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

  it('bounds prop', () => {
    const expected: LatLngBoundsExpression = [
      [1, 2],
      [3, 4]
    ];
    const wrapper = mount(VMap, { props: { bounds: expected } });
    expect(wrapper.vm.map?.getBounds()).toBeInstanceOf(LatLngBounds);
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

  it('default slot', () => {
    const wrapper = mount(VMap, {
      slots: {
        default: {
          setup() {
            return () => h('div', { class: 'child-component' });
          }
        }
      }
    });

    expect(wrapper.find('.child-component').exists()).toBe(true);
  });

  it('provide map', () => {
    let map: Readonly<Ref<Map | null>> | undefined = undefined;
    const wrapper = mount(VMap, {
      slots: {
        default: {
          setup() {
            map = useMap();
            return () => h('div', { class: 'child' });
          }
        }
      }
    });

    expect(map).toBeDefined();
    expect(wrapper.vm.map).toBeDefined();
    expect(wrapper.vm.map).toBe(map!.value);
  });

  it('leaflet event', async () => {
    const moveendListener = vi.fn();
    const zoomendListener = vi.fn();

    const wrapper = mount(VMap, {
      attrs: {
        onMoveend: moveendListener,
        onZoomend: zoomendListener
      }
    });

    await nextTick();

    wrapper.vm.map?.setView([1, 2], 3, { animate: false });

    expect(moveendListener).toBeCalledTimes(1);
    expect(zoomendListener).toBeCalledTimes(1);
  });

  it('view changed event', async () => {
    const listener = vi.fn();
    const wrapper = mount(VMap, {
      attrs: {
        onViewChanged: listener
      }
    });

    await nextTick();

    wrapper.vm.map?.setView([1, 2], 3, { animate: false });

    expect(listener).toBeCalledTimes(1);
    const ev = listener.mock.calls[0][0] as ViewChangedEvent;
    expect(ev.center).toEqual({ lat: 1, lng: 2 });
    expect(ev.zoom).toBe(3);
    expect(ev.bounds).toBeInstanceOf(LatLngBounds);
  });
});
