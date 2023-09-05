import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ref,
  unref,
  h,
  nextTick,
  defineComponent,
  type Ref,
  watch,
  markRaw
} from 'vue';
import { type LatLngExpression, Marker, Icon } from 'leaflet';
import { mount } from '../../../../.test';
import { VMap, provideMap } from '../../map';
import { useApi } from '../../../composables/useApi';
import { markerApiKey } from '../composables/injectionSymbols';
import VMapMarker from '../VMapMarker.vue';

describe('VMapMarker', () => {
  let latlng: LatLngExpression;

  beforeEach(() => {
    latlng = [1, 2];
  });

  function wrapComponent(
    defaultSlotFn: () => any,
    refs?: Record<string, unknown>,
    isRender: Ref<boolean> | boolean = true
  ) {
    return defineComponent({
      setup() {
        return { ...refs };
      },
      render() {
        return h(
          VMap,
          { ref: 'mapRef' },
          unref(isRender) ? { default: defaultSlotFn } : undefined
        );
      }
    });
  }

  it('should not render when latlng is null', () => {
    const vm = mount(
      defineComponent({
        setup() {
          return () => h(VMapMarker, { latlng: null });
        }
      })
    );
    expect(vm.$el.nodeType).toBe(Node.COMMENT_NODE);
  });

  it('should be expose instance', () => {
    const vm = mount(
      defineComponent({
        setup() {
          const componentRef = ref<InstanceType<typeof VMapMarker> | null>(
            null
          );

          return { componentRef };
        },
        render() {
          return h(VMapMarker, { latlng, ref: 'componentRef' });
        }
      })
    );

    expect(unref(vm.componentRef)).not.toBeNull();
    expect(vm.componentRef!.marker).toBeInstanceOf(Marker);
  });

  it('should work with latlng ref', async () => {
    const latlngRef = ref(latlng);

    const vm = mount(
      defineComponent({
        setup() {
          const componentRef = ref<InstanceType<typeof VMapMarker> | null>(
            null
          );

          return { componentRef, latlngRef };
        },
        render() {
          return h(VMapMarker, {
            latlng: this.latlngRef,
            ref: 'componentRef'
          });
        }
      })
    );

    expect(unref(vm.componentRef)).not.toBeNull();
    const { marker } = vm.componentRef!;
    expect(marker).toBeInstanceOf(Marker);
    expect(marker?.getLatLng()).toEqual({
      lat: 1,
      lng: 2
    });

    latlngRef.value = [3, 4];
    await nextTick();

    expect(marker?.getLatLng()).toEqual({
      lat: 3,
      lng: 4
    });
  });

  it('should add on map', async () => {
    const mapRef = ref<InstanceType<typeof VMap> | null>(null);
    const markerRef = ref<InstanceType<typeof VMapMarker> | null>(null);
    mount(
      wrapComponent(() => h(VMapMarker, { latlng, ref: 'markerRef' }), {
        mapRef,
        markerRef
      })
    );

    await nextTick();

    expect(unref(mapRef)).toBeTruthy();
    expect(unref(markerRef)).toBeTruthy();
    expect(unref(markerRef)?.marker).toBeInstanceOf(Marker);
    expect(
      unref(mapRef)?.map!.hasLayer(unref(markerRef)?.marker!)
    ).toBeTruthy();
  });

  it('should remove from map when component is unmounted', async () => {
    const mapRef = ref<InstanceType<typeof VMap> | null>(null);
    const markerRef = ref<InstanceType<typeof VMapMarker> | null>(null);
    const isRender = ref(true);
    mount(
      wrapComponent(
        () => h(VMapMarker, { latlng, ref: 'markerRef' }),
        {
          mapRef,
          markerRef
        },
        isRender
      )
    );

    await nextTick();

    expect(unref(mapRef)).toBeTruthy();
    expect(unref(markerRef)).toBeTruthy();
    const { marker } = unref(markerRef)!;
    expect(marker).toBeInstanceOf(Marker);

    isRender.value = false;

    await nextTick();

    expect(unref(markerRef)).toBeNull();
    expect(marker).toBeInstanceOf(Marker);
    expect(unref(mapRef)?.map!.hasLayer(marker!)).toBeFalsy();
  });

  it('should not be added to the map until the icon in the slot is created', async () => {
    let has = false;
    const map = {
      addLayer: vi.fn().mockImplementation(() => {
        has = true;
      }),
      removeLayer: vi.fn().mockImplementation(() => {
        has = false;
      }),
      hasLayer: () => has
    };

    const marker = ref<InstanceType<typeof VMapMarker> | null>(null);
    const icon = ref<Icon | null>(null);

    const Child = defineComponent({
      setup() {
        const markerApi = useApi(markerApiKey);
        watch(icon, val => {
          markerApi?.setIcon(val as Icon);
        });
        return () => null;
      }
    });

    const Root = defineComponent({
      setup() {
        provideMap(ref(map as any));
        return () =>
          h(VMapMarker, { latlng: [0, 0], ref: marker }, () => h(Child));
      }
    });

    mount(Root);

    expect(marker.value).not.toBeNull();
    expect(map.addLayer).not.toBeCalled();
    expect(marker.value?.marker?.options.icon).toBeInstanceOf(Icon.Default);

    icon.value = markRaw(new Icon({ iconUrl: 'foo.png' }));
    await nextTick();

    expect(map.removeLayer).toBeCalledTimes(0);
    expect(map.addLayer).toBeCalledTimes(1);
    expect(marker.value?.marker?.options.icon?.options.iconUrl).toBe('foo.png');

    icon.value = null;
    await nextTick();

    expect(map.addLayer).toBeCalledTimes(1);
    expect(map.removeLayer).toBeCalledTimes(1);
    expect(marker.value?.marker?.options.icon).toBeInstanceOf(Icon.Default);
    expect(marker.value?.marker?.options.icon?.options.iconUrl).not.toBe(
      'foo.png'
    );
  });

  it('should be added to the map when pass icon via prop', async () => {
    let has = false;
    const map = {
      addLayer: vi.fn().mockImplementation(() => {
        has = true;
      }),
      removeLayer: vi.fn().mockImplementation(() => {
        has = false;
      }),
      hasLayer: () => has
    };

    const marker = ref<InstanceType<typeof VMapMarker> | null>(null);
    const icon = ref<Icon | null>(null);

    const Root = defineComponent({
      setup() {
        provideMap(ref(map as any));
        return () =>
          h(VMapMarker, {
            latlng: [0, 0],
            icon: icon.value as Icon,
            ref: marker
          });
      }
    });

    mount(Root);

    expect(map.addLayer).toBeCalledTimes(1);
    expect(marker.value?.marker?.options.icon).toBeInstanceOf(Icon.Default);

    icon.value = markRaw(new Icon({ iconUrl: 'foo.png' }));
    await nextTick();

    expect(map.addLayer).toBeCalledTimes(1);
    expect(marker.value?.marker?.options.icon?.options.iconUrl).toBe('foo.png');
  });
});
