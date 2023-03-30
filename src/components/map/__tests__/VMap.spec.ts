import { describe, it, expect, vi } from 'vitest';
import {
  unref,
  h,
  nextTick,
  defineComponent,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
  ref
} from 'vue';
import { LatLngBounds, Map, type LatLngBoundsExpression } from 'leaflet';
import { mount } from '../../../../.test';
import { useMap } from '../composables';
import VMap from '../VMap.vue';

describe('VMap', () => {
  function mountMapComponent(props?: object, children?: any) {
    const mapRef = ref<InstanceType<typeof VMap> | null>(null);
    const { unmount } = mount(
      defineComponent({
        setup() {
          return { mapRef };
        },
        render() {
          return h(VMap, { ref: 'mapRef', ...props }, children);
        }
      })
    );
    const vm = unref(mapRef)!;
    (vm as any).unmount = unmount;
    return vm;
  }

  function expectMap(value: unknown) {
    expect(unref(value)).not.toBeNull();
    expect(unref(value)).toBeInstanceOf(Map);
  }

  it('render default props', async () => {
    const vm = mount(VMap);
    await nextTick();
    expect(vm.$el.outerHTML).toMatchSnapshot();
  });

  it('map and container exist', async () => {
    const vm = mount(VMap);
    await nextTick();
    expect(vm.container).toBeInstanceOf(HTMLElement);
    expectMap(vm.map);
  });

  it('center and zoom props', async () => {
    const vm = mountMapComponent({ center: [1, 2], zoom: 3 });
    await nextTick();
    expect(vm.map?.getZoom()).toBe(3);
    expect(vm.map?.getCenter()).toEqual({ lat: 1, lng: 2 });
  });

  it('bounds prop', async () => {
    const expected: LatLngBoundsExpression = [
      [1, 2],
      [3, 4]
    ];
    const vm = mountMapComponent({ bounds: expected });
    await nextTick();
    expect(vm.map?.getBounds()).toBeInstanceOf(LatLngBounds);
  });

  it('inherit css class', () => {
    const vm = mountMapComponent({ class: 'some-class' });
    expect(vm.$el.classList.contains('some-class')).toBe(true);
  });

  it('inherit css style', () => {
    const expected = 'height: 100px';
    const vm = mountMapComponent({ style: expected });
    expect(vm.$el.getAttribute('style')).contains(expected);
  });

  it('inherit id attrs', () => {
    const expected = 'map-1';
    const vm = mountMapComponent({ id: expected });
    expect(vm.$el.getAttribute('id')).contains(expected);
  });

  it('inherit any attrs', () => {
    const expected = 'map-1';
    const vm = mountMapComponent({
      elementAttrs: ['data-id'],
      'data-id': expected
    });
    expect(vm.$el.getAttribute('data-id')).contains(expected);
  });

  it('set leaflet property', async () => {
    const vm = mountMapComponent({
      maxZoom: 5
    });
    await nextTick();
    expect(vm.map?.getMaxZoom()).toBe(5);
  });

  it('default slot', async () => {
    const Child = defineComponent({
      setup() {
        return () => h('div', { class: 'child-component' });
      }
    });
    const vm = mountMapComponent(undefined, { default: () => h(Child) });

    await nextTick();

    expect(vm.$el.querySelector('.child-component')).toBeInstanceOf(
      HTMLElement
    );
  });

  it('provide map', async () => {
    expect.assertions(10);

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

    const vm = mountMapComponent(undefined, { default: () => h(Child) });

    await nextTick();

    (vm as any).unmount();
  });

  it('leaflet event', async () => {
    const moveendListener = vi.fn();
    const zoomendListener = vi.fn();

    const vm = mountMapComponent({
      onMoveend: moveendListener,
      onZoomend: zoomendListener
    });

    await nextTick();

    vm.map!.setView([1, 2], 3, { animate: false });

    expect(moveendListener).toBeCalledTimes(1);
    expect(zoomendListener).toBeCalledTimes(1);
  });

  it('view changed event', async () => {
    const listener = vi.fn();
    const vm = mountMapComponent({
      onViewChanged: listener
    });

    await nextTick();

    vm.map?.setView([1, 2], 3, { animate: false });

    expect(listener).toBeCalledTimes(1);
    const ev = listener.mock.calls[0][0];
    expect(ev.center).toEqual({ lat: 1, lng: 2 });
    expect(ev.zoom).toBe(3);
    expect(ev.bounds).toBeInstanceOf(LatLngBounds);
  });
});
