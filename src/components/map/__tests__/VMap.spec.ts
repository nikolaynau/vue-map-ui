import { describe, it, expect, vi } from 'vitest';
import {
  unref,
  h,
  nextTick,
  defineComponent,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted
} from 'vue';
import { mount } from '@vue/test-utils';
import { LatLngBounds, Map, type LatLngBoundsExpression } from 'leaflet';
import { useMap } from '@/composables';
import VMap from '../VMap.vue';

describe('VMap', () => {
  it('render default props', () => {
    const wrapper = mount(VMap);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('map and container exist', () => {
    const wrapper = mount(VMap);
    expect(wrapper.vm.container).not.toBeNull();
    expect(wrapper.vm.map).toBeInstanceOf(Map);
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
      props: { elementAttrs: ['data-id'] },
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

  it('default slot', async () => {
    const wrapper = mount(VMap, {
      slots: {
        default: {
          setup() {
            return () => h('div', { class: 'child-component' });
          }
        }
      }
    });

    await nextTick();

    expect(wrapper.find('.child-component').exists()).toBe(true);
  });

  /*it('provide map', async () => {
    expect.assertions(5);

    const expectMap = (map: unknown) => expect(unref(map)).toBeInstanceOf(Map);

    const Child = defineComponent({
      setup() {
        const map = useMap();
        expectMap(map);

        onBeforeMount(() => {
          expectMap(map);
        });
        onMounted(() => {
          expectMap(map);
        });
        onBeforeUnmount(() => {
          expectMap(map);
        });
        onUnmounted(() => {
          expectMap(map);
        });

        return () => h('div', { class: 'child' });
      }
    });

    const Root = defineComponent({
      setup() {
        return () => h(VMap, null, { default: () => h(Child) });
      }
    });

    const wrapper = mount(Root);
    await nextTick();
    wrapper.unmount();
  });*/

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
    const ev = listener.mock.calls[0][0];
    expect(ev.center).toEqual({ lat: 1, lng: 2 });
    expect(ev.zoom).toBe(3);
    expect(ev.bounds).toBeInstanceOf(LatLngBounds);
  });

  it('should be defined map in children component when parent is mounted', () => {
    expect.assertions(1);

    mount(VMap, {
      slots: {
        default: defineComponent({
          setup() {
            const map = useMap();
            onMounted(() => {
              expect(unref(map)).toBeInstanceOf(Map);
            });
            return () => null;
          }
        })
      }
    });
  });
});
